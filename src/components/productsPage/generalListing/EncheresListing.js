import React from "react";
import AuctionList from "../AuctionList";

const EncheresListing = () => (
  <AuctionList
    kind="enchere"
    tabs
    title="Toutes les enchères"
    subtitle="Placez vos offres sur des articles du monde entier, en direct, sans frais de participation."
  />
);

export default EncheresListing;
