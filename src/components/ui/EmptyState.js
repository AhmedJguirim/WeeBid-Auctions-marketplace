import React from "react";
import { useTranslation } from "react-i18next";
import { PackageOpen } from "lucide-react";

const EmptyState = ({ title, text, action }) => {
  const { t } = useTranslation();
  return (
  <div className="col-span-full flex flex-col items-center border border-gray-300 px-6 py-16 text-center">
    <PackageOpen size={28} className="text-gray-400" strokeWidth={1.5} />
    <h3 className="mt-4 font-serif text-lg font-bold text-gray-900">{title || t("empty.title")}</h3>
    {text && <p className="mt-1 max-w-md text-sm text-gray-500">{text}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
  );
};

export default EmptyState;
