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
  pass: "OK",
  fail: "Unavailable",
  pending: "Checking",
  skipped: "Not checked",
} as const;

export function HeaderStatus({ checks }: HeaderStatusProps) {
  const detailsId = useId();
  const [openCheck, setOpenCheck] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const passing = checks.filter(({ state }) => state === "pass").length;
  const failing = checks.filter(({ state }) => state === "fail").length;
  const pending = checks.some(({ state }) => state === "pending");
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
        onClose={() => setOpenCheck(null)}
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
              {checks.map(({ label, state, detail }, index) => {
                const id = `${detailsId}-${index}`;
                const expanded = openCheck === label;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      className="pq-health-check"
                      data-state={state}
                      aria-expanded={expanded}
                      aria-controls={id}
                      aria-describedby={id}
                      onClick={() => setOpenCheck(expanded ? null : label)}
                    >
                      {label}
                    </button>
                    <div className="pq-health-detail" id={id}>
                      {stateLabels[state]}{detail ? ` · ${detail}` : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}
