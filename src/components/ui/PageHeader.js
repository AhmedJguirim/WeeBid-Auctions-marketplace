import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Venia-style page head: breadcrumb on the left, centred title underneath.
const PageHeader = ({ title, subtitle, actions, children }) => {
  const { t } = useTranslation();
  return (
    <div className="container-page pt-6">
      <nav aria-label="breadcrumb" className="text-xs text-gray-900">
        <Link to="/" className="underline underline-offset-2 hover:text-brand-600">{t("footer.home")}</Link>
        <span className="mx-2">/</span>
        <span>{title}</span>
      </nav>
      <div className="mt-6 text-center">
        <h1 className="font-sans text-2xl font-normal text-gray-900">{title}</h1>
        {subtitle && <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">{subtitle}</p>}
      </div>
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
      {children && <div className="pt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
