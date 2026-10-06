"""The shared terminal contract, tested independently of application servers."""

import io
import json
import logging
from pathlib import Path
import re
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pq_terminal import Terminal


COLORS = json.loads(
    Path(__file__).resolve().parents[2].joinpath("tokens.json").read_text()
)["color"]
URL = "http://127.0.0.1:8766"


class TTY(io.StringIO):
    def isatty(self):
        return True


def plain(value):
    return re.sub(r"\033\[[0-9;]*m", "", value)


@pytest.mark.parametrize("name", ["PQSetup", "PQViewer", "PQEnalyzer"])
@pytest.mark.parametrize("columns", [80, 48, 36])
def test_terminal_identity_and_server_url_fit(monkeypatch, name, columns):
    """A portrait-width shell keeps the brand, version and copyable URL."""
    stream = TTY()
    monkeypatch.setattr(sys, "stdout", stream)
    monkeypatch.setenv("TERM", "xterm-256color")
    monkeypatch.setenv("COLUMNS", str(columns))
    monkeypatch.delenv("NO_COLOR", raising=False)

    Terminal(name, "1.2.3", COLORS).startup(URL, [("Data", "5,000 rows / 1 file")])

    output = stream.getvalue()
    text = plain(output)
    assert name in text and "1.2.3" in text and "Web" in text
    assert URL in text and "5,000 rows / 1 file" in text
    assert "Ctrl+C to stop" in text
    assert max(map(len, text.splitlines())) <= columns
    assert "38;2;15;98;254" in output
    if columns == 80:
        assert "/ ____/" in text


@pytest.mark.parametrize("opt_out", ["NO_COLOR", "TERM", "redirect"])
def test_plain_terminal_and_redirected_output(monkeypatch, opt_out):
    stream = io.StringIO() if opt_out == "redirect" else TTY()
    monkeypatch.setattr(sys, "stdout", stream)
    monkeypatch.setenv("TERM", "xterm-256color")
    monkeypatch.delenv("NO_COLOR", raising=False)
    if opt_out == "NO_COLOR":
        monkeypatch.setenv("NO_COLOR", "1")
    elif opt_out == "TERM":
        monkeypatch.setenv("TERM", "dumb")

    Terminal("PQEnalyzer", "1.2.3", COLORS).startup(URL, [("Data", "1 row / 1 file")])

    output = stream.getvalue()
    assert "\033" not in output
    assert URL in output and "1 row / 1 file" in output
    if opt_out != "NO_COLOR":
        assert output.splitlines() == [
            "PQEnalyzer  Web", "Data   1 row / 1 file", f"Open   {URL}", "Stop   Ctrl+C",
        ]


@pytest.mark.parametrize("stdout_tty,stderr_tty", [(True, False), (False, True)])
def test_argparse_errors_style_the_actual_destination(
        monkeypatch, stdout_tty, stderr_tty):
    """Redirecting one stream never leaks its color choice into the other."""
    out = TTY() if stdout_tty else io.StringIO()
    err = TTY() if stderr_tty else io.StringIO()
    monkeypatch.setattr(sys, "stdout", out)
    monkeypatch.setattr(sys, "stderr", err)
    monkeypatch.setenv("TERM", "xterm-256color")
    monkeypatch.delenv("NO_COLOR", raising=False)
    parser = Terminal("PQSetup", "1.2.3", COLORS).argument_parser(prog="pqsetup")
    parser.add_argument("--port", type=int)

    with pytest.raises(SystemExit) as exited:
        parser.parse_args(["--port", "invalid"])

    assert exited.value.code == 2
    assert out.getvalue() == ""
    assert "invalid int value" in plain(err.getvalue())
    assert ("\033[" in err.getvalue()) is stderr_tty


def test_subcommand_help_shares_identity_and_defaults(monkeypatch):
    out = TTY()
    monkeypatch.setattr(sys, "stdout", out)
    monkeypatch.setenv("TERM", "xterm-256color")
    monkeypatch.delenv("NO_COLOR", raising=False)
    parser = Terminal("PQViewer", "1.2.3", COLORS).argument_parser(prog="pqview")
    web = parser.add_subparsers().add_parser("web")
    web.add_argument("--port", default=8766, help="Port (default: %(default)s).")

    with pytest.raises(SystemExit) as exited:
        parser.parse_args(["web", "--help"])

    text = plain(out.getvalue())
    assert exited.value.code == 0
    assert "PQViewer" in text and "1.2.3" in text
    assert "pqview web" in text and "--port" in text and "8766" in text


@pytest.mark.parametrize("interactive", [True, False])
def test_event_logger_is_independent_and_reconfiguration_does_not_duplicate(
        monkeypatch, interactive):
    """A host logger with raising errors cannot alter app control flow."""
    class HostLogger(logging.Logger):
        def error(self, *args, **kwargs):
            raise RuntimeError("host error behavior")

    err = TTY() if interactive else io.StringIO()
    monkeypatch.setattr(sys, "stderr", err)
    monkeypatch.setenv("TERM", "xterm-256color")
    monkeypatch.delenv("NO_COLOR", raising=False)
    previous = logging.getLoggerClass()
    logging.setLoggerClass(HostLogger)
    try:
        terminal = Terminal("PQEnalyzer", "1.2.3", COLORS)
        terminal.configure_logging("info")
        terminal.configure_logging("info")
        terminal.log.debug("hidden detail")
        terminal.log.info("Dataset updated")
        terminal.log.error("Could not read input")
        assert logging.getLoggerClass() is HostLogger
    finally:
        logging.setLoggerClass(previous)

    text = plain(err.getvalue())
    assert text.count("Dataset updated") == 1
    assert text.count("Could not read input") == 1
    assert "hidden detail" not in text
    assert re.search(r"\d{2}:\d{2}:\d{2}\s+INFO\s+Dataset updated", text)
    assert re.search(r"\d{2}:\d{2}:\d{2}\s+ERROR\s+Could not read input", text)
    assert ("\033[" in err.getvalue()) is interactive
    if not interactive:
        assert all(line == line.rstrip() for line in text.splitlines())
