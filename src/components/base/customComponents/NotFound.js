import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
    <p className="bg-gradient-to-br from-brand-500 to-brand-800 bg-clip-text text-8xl font-black text-transparent sm:text-9xl">404</p>
    <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Page introuvable</h1>
    <p className="mt-2 max-w-md text-slate-500">La page que vous cherchez n'existe pas ou a été déplacée.</p>
    <Link to="/" className="btn-primary mt-6">Retour à l'accueil</Link>
  </div>
);

export default NotFound;
