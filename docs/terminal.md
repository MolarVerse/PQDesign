# Terminal

The Python renderer gives PQSetup, PQViewer and PQEnalyzer a common terminal
identity. Its slant wordmarks follow the PQAnalysis CLI.

| Part | Behavior |
| --- | --- |
| Wordmark | Appears when it fits; narrow terminals show the app name |
| Identity | App, installed version and interface |
| Browser | Full URL, shown after the server is ready |
| Events | Local server time, level and actual action |
| Plain output | No ANSI for redirects, `NO_COLOR` or `TERM=dumb` |

## Use in a Python application

After installing the design archive:

```bash
cp node_modules/@molarverse/pq-design/python/pq_terminal.py my_app/_design_terminal.py
cp node_modules/@molarverse/pq-design/tokens.json my_app/design/tokens.json
```

Declare `rich>=13` and `rich-argparse>=1.7` as Python dependencies.
Compare both vendored files with the archive in CI; change the renderer here.

Use the application's installed version and token colors:

```python
from ._design_terminal import Terminal

terminal = Terminal("PQSetup", app_version, tokens["color"])
parser = terminal.argument_parser(prog="pqsetup")
terminal.configure_logging("info")
```

After successful server startup:

```python
terminal.startup(url, details=[("Data", dataset_summary)])
terminal.log.info("Server ready")
```

After building a desktop window:

```python
terminal.desktop(details=[("Data", dataset_summary)])
terminal.log.info("Desktop ready")
```

The application owns URL validation, readiness, shutdown and event selection. The renderer
does not open browsers, bind ports, monitor files or configure global loggers.

## Logging

| Level | Use |
| --- | --- |
| `info` | Readiness, data changes, completed actions and shutdown |
| `warning` | Recoverable problems |
| `error` | Failed operations, with their reason |
| `debug` | Detailed diagnostics; applications may include HTTP requests |

Events go to stderr. Redirected logs remain plain, without padding:

```text
15:16:55 INFO    Server ready
15:17:02 INFO    Dataset updated
```

Log completed actions after they succeed. Keep health checks, frame fetches,
render previews, SSE heartbeats and repeated unchanged refreshes out of `info`.
Use `terminal.log` for events: it is a plain Python logger, independent of any
logger class installed by another package. Calling `configure_logging` again
replaces its handler rather than duplicating messages.
