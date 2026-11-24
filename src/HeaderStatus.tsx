import { useId, useRef, useState } from "react";
import { DialogHeading } from "./DialogHeading";

export interface HealthCheck {
  label: string;
  state: "pass" | "fail" | "pending" | "skipped";
  detail?: string;
}

export interface HeaderStatusProps {
  checks: readonly HealthCheck[];

}

const stateLabels = {
  pass: "Passed",
  fail: "Failed",
  pending: "Checking",
  skipped: "Not checked",
} as const;

const stateSymbols = { pass: "✓", fail: "×", pending: "…", skipped: "–" } as const;

export function HeaderStatus({ checks }: HeaderStatusProps) {
  const detailsId = useId();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const passing = checks.filter(({ state }) => state === "pass").length;
  const failing = checks.filter(({ state }) => state === "fail").length;
  const pending = checks.some(({ state }) => state === "pending");
  const detail = checks.find((check) => check.state === "fail" && check.detail)
    ?? checks.find((check) => check.state === "pending" && check.detail)
    ?? checks.find((check) => check.state === "skipped" && check.detail)
    ?? checks.find((check) => check.detail);
  const [tone, summary] = failing
    ? passing ? ["warning", "Some checks failed"] : ["offline", "No checks passed"]
    : pending ? ["idle", "Checking status"] : passing ? ["ready", "All checks passed"] : ["idle", "No checks yet"];

  return (
    <>
      <button
        type="button"
        className="pq-header-indicator"
        data-tone={tone}
        title={summary}
        aria-label={`Show status: ${summary}`}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <span className="pq-header-status-label" aria-hidden="true">{summary}</span>
        <span className="pq-header-status-dot" aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="pq-header-files pq-status-dialog"
        data-tone={tone}
        aria-label="Status"
        onClose={() => setDetailsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="pq-header-files-panel">
          <DialogHeading
            title={<span className="pq-status-message" aria-live="polite">
              <span className="pq-header-status-dot" aria-hidden="true" />
              {summary}
            </span>}
            onClose={() => dialog.current?.close()}
          />
          <div className="pq-status-dialog-body" aria-live="polite">
            <ul className="pq-health-checks" role="list">
              {checks.map(({ label, state }) => (
                <li key={label} className="pq-health-check">
                  <span>{label}</span>
                  <span className="pq-health-symbol" data-state={state}
                    role="img" aria-label={stateLabels[state]}>{stateSymbols[state]}</span>
                </li>
              ))}
            </ul>
            {detail && (
              <>
                <button type="button" className="pq-health-details-toggle"
                  aria-expanded={detailsOpen} aria-controls={detailsId}
                  onClick={() => setDetailsOpen(!detailsOpen)}>Details</button>
                <p id={detailsId} className="pq-health-detail" hidden={!detailsOpen}>
                  {detail.label}: {detail.detail}
                </p>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
