import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiRoutes } from "../../../config/routes";
import AuctionList from "../AuctionList";

const EncheresParCategory = () => {
  const { categoryId } = useParams();
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    axios.get(`${apiRoutes.API}/categories/${categoryId}`).then((r) => setName(r.data.name)).catch(() => {});
  }, [categoryId]);
  return <AuctionList kind="enchere" filters={{ category: categoryId }} title={`Enchères · ${name}`} subtitle="Toutes les enchères de cette catégorie." />;
};

export default EncheresParCategory;
