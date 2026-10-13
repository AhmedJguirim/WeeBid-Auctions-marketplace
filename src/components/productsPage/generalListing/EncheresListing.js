import React from "react";
import { useTranslation } from "react-i18next";
import AuctionList from "../AuctionList";

const EncheresListing = () => {
  const { t } = useTranslation();
  return <AuctionList kind="enchere" tabs title={t("list.allTitle")} subtitle={t("list.allSubtitle")} />;
};

export default EncheresListing;
