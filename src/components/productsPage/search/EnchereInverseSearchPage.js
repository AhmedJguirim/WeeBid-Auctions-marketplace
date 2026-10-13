import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuctionList from "../AuctionList";

const EnchereInverseSearchPage = () => {
  const { t } = useTranslation();
  const { search } = useParams();
  return <AuctionList kind="inverse" filters={{ "article.name": search }} title={t("list.searchTitle", { search })} subtitle={t("list.searchReverseSubtitle")} />;
};

export default EnchereInverseSearchPage;
