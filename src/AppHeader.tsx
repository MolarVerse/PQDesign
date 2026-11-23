import { useRef, type ReactNode } from "react";
import { DialogHeading } from "./DialogHeading";

export interface AppHeaderProps {
  name: string;
  logo: string;
  context?: string;
  files?: readonly string[];
  search: ReactNode;
  actions?: ReactNode;
  status?: ReactNode;
  modes?: ReactNode;
  mobileSearch?: "inline" | "row";
  className?: string;
  actionsClassName?: string;
}

export function AppHeader({
  name,
  logo,
  context,
  files,
  search,
  actions,
  status,
  modes,
  mobileSearch = "inline",
  className,
  actionsClassName,
}: AppHeaderProps) {
  const filesDialog = useRef<HTMLDialogElement>(null);
  const identity = (
    <>
      <img src={logo} alt="" />
      <div className="pq-header-identity">
        <strong>{name}</strong>
        {context && <span className="pq-header-context" title={context}>{context}</span>}
      </div>
    </>
  );

  return (
    <header
      className={className ? `pq-app-header ${className}` : "pq-app-header"}
      data-mobile-search={mobileSearch}
    >
      <div className="pq-header-start">
        {files?.length ? (
          <button
            type="button"
            className="pq-header-brand pq-header-file-button"
            aria-label={`Show current files in ${name}`}
            aria-haspopup="dialog"
            title="Show current files"
            onClick={() => filesDialog.current?.showModal()}
          >
            {identity}
          </button>
        ) : <div className="pq-header-brand">{identity}</div>}
      </div>
      {files?.length ? (
        <dialog
          ref={filesDialog}
          className="pq-header-files"
          aria-label="Current files"
          onClick={(event) => {
            if (event.target === event.currentTarget) filesDialog.current?.close();
          }}
        >
          <div className="pq-header-files-panel">
            <DialogHeading title="Current files" onClose={() => filesDialog.current?.close()} />
            <ul>{files.map((file, index) => <li key={`${index}:${file}`}>{file}</li>)}</ul>
          </div>
        </dialog>
      ) : null}
      <div className="pq-header-search">{search}</div>
      <div className="pq-header-end">
        {(modes || actions) && (
          <div className="pq-header-controls">
            {modes && <div className="pq-header-modes">{modes}</div>}
            {actions && (
              <div className={actionsClassName ? `pq-header-actions ${actionsClassName}` : "pq-header-actions"} role="group" aria-label={`${name} actions`}>
                {actions}
              </div>
            )}
          </div>
        )}
        {status && <div className="pq-header-status">{status}</div>}
      </div>
    </header>
  );
}
