import React from "react";
import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";

const WorkInProgress = () => (
  <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Hammer size={26} /></span>
    <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Bientôt disponible</h1>
    <p className="mt-2 text-slate-500">Cette page est en cours de construction.</p>
    <Link to="/" className="btn-primary mt-6">Retour à l'accueil</Link>
  </div>
);

export default WorkInProgress;
