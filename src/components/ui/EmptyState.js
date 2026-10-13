import React from "react";
import { PackageOpen } from "lucide-react";

const EmptyState = ({ title = "Rien à afficher pour le moment", text, action }) => (
  <div className="card col-span-full flex flex-col items-center px-6 py-16 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
      <PackageOpen size={26} />
    </span>
    <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
    {text && <p className="mt-1 max-w-md text-sm text-slate-500">{text}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
