import React from "react";
import { useParams } from "react-router-dom";
import AuctionList from "../AuctionList";

const EnchereSearchPage = () => {
  const { search } = useParams();
  return <AuctionList kind="enchere" filters={{ "article.name": search }} title={`Résultats pour « ${search} »`} subtitle="Enchères correspondant à votre recherche." />;
};

export default EnchereSearchPage;
