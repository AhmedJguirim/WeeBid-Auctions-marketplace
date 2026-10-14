import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-8xl font-bold text-gray-900">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{t("notFound.title")}</h1>
      <p className="mt-2 max-w-md text-gray-500">{t("notFound.text")}</p>
      <Link to="/" className="btn-primary mt-6">{t("notFound.home")}</Link>
    </div>
  );
};

export default NotFound;
