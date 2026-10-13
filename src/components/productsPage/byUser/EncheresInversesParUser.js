import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoutes } from "../../../config/routes";
import AuctionList from "../AuctionList";

const EncheresInversesParUser = () => {
  const { id } = useParams();
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    axios.get(`${apiRoutes.API}/users/${id}`).then((r) => setName(r.data.displayName)).catch(() => {});
  }, [id]);
  return <AuctionList kind="inverse" filters={{ user: id }} title={`Enchères inversées de ${name}`} subtitle="Les besoins publiés par ce membre." />;
};

export default EncheresInversesParUser;
