import { Search } from "lucide-react";

export interface SearchTriggerProps {
  label: string;
  accessibleName?: string;
  shortcut: string;
  open: boolean;
  onOpen: () => void;
  disabled?: boolean;
  mobile?: "icon" | "bar";
  className?: string;
}

export function SearchTrigger({
  label,
  accessibleName = label,
  shortcut,
  open,
  onOpen,
  disabled,
  mobile = "icon",
  className,
}: SearchTriggerProps) {
  return (
    <button
      type="button"
      className={className ? `pq-search-trigger ${className}` : "pq-search-trigger"}
      data-mobile={mobile}
      aria-label={accessibleName}
      aria-keyshortcuts="Control+K Meta+K"
      aria-haspopup="dialog"
      aria-expanded={open}
      title={accessibleName}
      disabled={disabled}
      onClick={onOpen}
    >
      <Search className="pq-search-icon" size={16} aria-hidden="true" />
      <span>{label}</span>
      <kbd aria-hidden="true">{shortcut}</kbd>
    </button>
  );
}
