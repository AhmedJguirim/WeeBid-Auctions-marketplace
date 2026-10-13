import React from "react";
import { useParams } from "react-router-dom";
import AuctionList from "../AuctionList";

const EnchereInverseSearchPage = () => {
  const { search } = useParams();
  return <AuctionList kind="inverse" filters={{ "article.name": search }} title={`Résultats pour « ${search} »`} subtitle="Enchères inversées correspondant à votre recherche." />;
};

export default EnchereInverseSearchPage;
