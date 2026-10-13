import React from "react";
import { useTranslation } from "react-i18next";
import AuctionList from "../AuctionList";

const EncheresInvListing = () => {
  const { t } = useTranslation();
  return <AuctionList kind="inverse" tabs title={t("list.reverseTitle")} subtitle={t("list.reverseSubtitle")} />;
};

export default EncheresInvListing;
