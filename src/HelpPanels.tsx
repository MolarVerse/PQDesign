import { ArrowLeft, BookOpen, CircleHelp, ExternalLink, Keyboard } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import Modal from "./Modal";

export type HelpPage = "help" | "shortcuts";

export function HelpButton({ open, disabled, onClick }: {
  open: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" data-header-action="" className="pq-help-trigger" aria-label="Help"
      aria-haspopup="dialog" aria-expanded={open} title="Help" disabled={disabled} onClick={onClick}>
      <CircleHelp aria-hidden="true" />
    </button>
  );
}

export function HelpPanels({ page, onPage, docs, intro, groups, shortcutOptions }: {
  page: HelpPage | null;
  onPage: (page: HelpPage | null) => void;
  docs: string;
  intro: ReactNode;
  groups: readonly { title?: string; items: readonly (readonly [string, string])[] }[];
  shortcutOptions?: ReactNode;
}) {
  const navigate = (event: MouseEvent<HTMLButtonElement>, next: HelpPage) => {
    event.currentTarget.closest("dialog")?.querySelector<HTMLButtonElement>(".pq-dialog-close")?.focus();
    onPage(next);
  };
  return (
    <Modal open={page !== null} title={page === "shortcuts" ? "Keyboard shortcuts" : "Help"}
      className="pq-help-dialog" onClose={() => onPage(null)}>
      {page === "help" ? <>
        <div className="pq-help-intro">{intro}</div>
        <div className="pq-help-menu">
          <a href={docs} target="_blank" rel="noreferrer" aria-label="Documentation (opens in a new tab)">
            <BookOpen aria-hidden="true" />
            <span>Documentation</span>
            <ExternalLink aria-hidden="true" />
          </a>
          <button type="button" onClick={(event) => navigate(event, "shortcuts")}>
            <Keyboard aria-hidden="true" />
            <span>Keyboard shortcuts</span>
          </button>
        </div>
      </> : <>
        {groups.map(({ title, items }) => (
          <section className="pq-shortcuts-group" key={title ?? ""}>
            {title && <h3>{title}</h3>}
            <dl>
              {items.map(([keys, label]) => (
                <div key={label}><dt><kbd>{keys}</kbd></dt><dd>{label}</dd></div>
              ))}
            </dl>
          </section>
        ))}
        {shortcutOptions}
        <div className="pq-help-menu">
          <button type="button" onClick={(event) => navigate(event, "help")}>
            <ArrowLeft aria-hidden="true" />
            <span>Help</span>
          </button>
        </div>
      </>}
    </Modal>
  );
}
