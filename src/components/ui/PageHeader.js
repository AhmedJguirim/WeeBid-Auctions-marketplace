import React from "react";

const PageHeader = ({ title, subtitle, actions, children }) => (
  <div className="border-b border-slate-200 bg-white">
    <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
    {children && <div className="container-page pb-4">{children}</div>}
  </div>
);

export default PageHeader;
