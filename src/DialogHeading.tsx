import { X } from "lucide-react";
import type { ReactNode } from "react";

export function DialogHeading({ title, subtitle, onClose, closeLabel = "Close" }: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
}) {
  return (
    <header className="pq-dialog-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <button type="button" className="pq-dialog-close" aria-label={closeLabel} onClick={onClose}>
        <X size={16} aria-hidden="true" />
      </button>
    </header>
  );
}
