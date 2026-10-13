import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRoutes } from "../../../config/routes";
import AuctionList from "../AuctionList";

const EncheresInversesParUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    axios.get(`${apiRoutes.API}/users/${id}`).then((r) => setName(r.data.displayName)).catch(() => {});
  }, [id]);
  return <AuctionList kind="inverse" filters={{ user: id }} title={t("list.userReverseTitle", { name })} subtitle={t("list.userReverseSubtitle")} />;
};

export default EncheresInversesParUser;
