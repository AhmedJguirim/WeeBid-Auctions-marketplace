import React from "react";
import { Link } from "react-router-dom";

// Plain wordmark. Swap for <img src="/assets/logo.svg" alt="WeeBid" /> once the real logo exists.
const Logo = ({ light = false }) => (
  <Link to="/" className={`font-serif text-2xl font-bold ${light ? "text-white" : "text-gray-900"}`}>
    WeeBid
  </Link>
);

export default Logo;
