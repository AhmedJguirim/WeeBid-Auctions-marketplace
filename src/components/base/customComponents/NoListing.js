import React from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../../ui/EmptyState";

const NoListing = ({ text }) => {
  const { t } = useTranslation();
  return <EmptyState title={t("empty.nothing")} text={text} />;
};

export default NoListing;
