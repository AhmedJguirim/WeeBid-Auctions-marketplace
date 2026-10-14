import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

// Small accessible modal: closes on Escape / backdrop click.
const Modal = ({ open, onClose, title, children, footer, size = "md" }) => {
  const { t } = useTranslation();
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = { md: "max-w-md", lg: "max-w-2xl" }[size];
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} />
      <div className={`relative flex max-h-[90vh] w-full ${width} flex-col bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
          <h3 className="font-serif text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} aria-label={t("common.close")} className="rounded-sm p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-gray-300 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
