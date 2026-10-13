import React from "react";
import AuctionList from "../AuctionList";

const EncheresInvListing = () => (
  <AuctionList
    kind="inverse"
    tabs
    title="Enchères inversées"
    subtitle="Un acheteur publie son besoin, les vendeurs s'affrontent à coups de réductions : le prix le plus bas gagne."
  />
);

export default EncheresInvListing;
