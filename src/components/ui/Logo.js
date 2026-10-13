import React from "react";
import { Link } from "react-router-dom";
import { Gavel } from "lucide-react";

const Logo = ({ light = false }) => (
  <Link to="/" className="inline-flex items-center gap-2">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
      <Gavel size={18} />
    </span>
    <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
      Wee<span className={light ? "text-brand-300" : "text-brand-600"}>Bid</span>
    </span>
  </Link>
);

export default Logo;
