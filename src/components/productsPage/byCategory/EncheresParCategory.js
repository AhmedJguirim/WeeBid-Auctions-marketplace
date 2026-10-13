import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRoutes } from "../../../config/routes";
import AuctionList from "../AuctionList";

const EncheresParCategory = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    axios.get(`${apiRoutes.API}/categories/${categoryId}`).then((r) => setName(r.data.name)).catch(() => {});
  }, [categoryId]);
  return <AuctionList kind="enchere" filters={{ category: categoryId }} title={t("list.categoryTitle", { name })} subtitle={t("list.categorySubtitle")} />;
};

export default EncheresParCategory;
