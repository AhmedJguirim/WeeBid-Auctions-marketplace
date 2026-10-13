import React from "react";
import { Navigate } from "react-router-dom";
import { navRoutes } from "../../config/routes";

// the history page only ever showed placeholder rows: send people to the auctions
const EncheresHistory = () => <Navigate to={navRoutes.ENCHERES} replace />;

export default EncheresHistory;
