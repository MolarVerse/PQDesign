import { DialogHeading } from "./DialogHeading";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Carbon-style modal on top of the native <dialog>: square, white, hairline
 * header, Esc / backdrop / × all close it. Children mount only while open.
 */
export default function Modal({
  open,
  title,
  subtitle,
  size = "md",
  className,
  onClose,
  children,
}: {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  size?: "md" | "lg" | "full" | "input";
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal modal-${size}${className ? ` ${className}` : ""}`}
      aria-label={typeof title === "string" ? title : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <>
          <DialogHeading title={title} subtitle={subtitle} onClose={onClose} />
          <div className="modal-body">{children}</div>
        </>
      )}
    </dialog>
  );
}
