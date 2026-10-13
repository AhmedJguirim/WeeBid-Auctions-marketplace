import React from "react";
import { useTranslation } from "react-i18next";
import { Gavel, ShieldCheck, Zap } from "lucide-react";
import Logo from "./Logo";

const points = [
  [Gavel, "auth.point1"],
  [Zap, "auth.point2"],
  [ShieldCheck, "auth.point3"],
];

// Split-screen layout shared by login and register.
const AuthLayout = ({ title, subtitle, footer, children, wide = false }) => {
  const { t } = useTranslation();
  return (
  <div className="-mb-20 grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
    <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="relative">
        <Logo light />
      </div>
      <div className="relative">
        <h2 className="max-w-md text-4xl font-black leading-tight tracking-tight">
          {t("auth.tagline1")} <span className="text-brand-300">{t("auth.tagline2")}</span>
        </h2>
        <ul className="mt-8 space-y-4">
          {points.map(([Icon, key]) => (
            <li key={key} className="flex items-center gap-3 text-slate-300">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-brand-200"><Icon size={18} /></span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} WeeBid</p>
    </div>
    <div className="flex items-center justify-center px-4 py-12 sm:px-8">
      <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>}
      </div>
    </div>
  </div>
  );
};

export default AuthLayout;
