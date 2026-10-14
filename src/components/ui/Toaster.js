import React from "react";
import { AlertTriangle, X } from "lucide-react";

// Small stack of toasts fed by window "weebid:toast" events (see utils/httpErrors.js).
const Toaster = () => {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const onToast = (e) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list.slice(-2), { id, ...e.detail }]);
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 6000);
    };
    window.addEventListener("weebid:toast", onToast);
    return () => window.removeEventListener("weebid:toast", onToast);
  }, []);

  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-white" />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))} aria-label="×"><X size={16} className="text-gray-400" /></button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
