import React from "react";
import { Navigate } from "react-router-dom";
import { navRoutes } from "../../config/routes";

// legacy "ventes" page was never implemented: send people to the auctions
const VentesListing = () => <Navigate to={navRoutes.ENCHERES} replace />;

export default VentesListing;
