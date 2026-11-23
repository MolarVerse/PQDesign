import { RefreshCw, RefreshCwOff } from "lucide-react";

export function AutoRefreshButton({
  active,
  disabled,
  onToggle,
}: {
  active: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const Icon = active ? RefreshCw : RefreshCwOff;
  return (
    <button
      type="button"
      className="pq-auto-refresh"
      aria-label="Auto-refresh"
      aria-pressed={active}
      title={active ? "Pause auto-refresh" : "Enable auto-refresh"}
      disabled={disabled}
      onClick={onToggle}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}
