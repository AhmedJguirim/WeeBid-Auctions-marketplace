import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRoutes } from "../../../config/routes";
import AuctionList from "../AuctionList";

const EncheresParUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    axios.get(`${apiRoutes.API}/users/${id}`).then((r) => setName(r.data.displayName)).catch(() => {});
  }, [id]);
  return <AuctionList kind="enchere" filters={{ user: id }} title={t("list.userTitle", { name })} subtitle={t("list.userSubtitle")} />;
};

export default EncheresParUser;
