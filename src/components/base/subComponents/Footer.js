import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Github, Mail } from "lucide-react";
import { navRoutes } from "../../../config/routes";
import Logo from "../../ui/Logo";

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h4>
    <ul className="mt-4 space-y-2.5">
      {links.map(([text, path]) => (
        <li key={path}>
          <Link to={path} className="text-sm text-slate-400 transition hover:text-white">{text}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const user = useSelector((state) => state.user);
  const loggedIn = user.id !== undefined;

  const explore = [
    ["Toutes les enchères", navRoutes.ENCHERES],
    ["Enchères inversées", navRoutes.ENCHERESINVERSES],
    ["Catégories", navRoutes.CATEGORIES],
  ];
  const account = loggedIn
    ? [
        ["Vendre un article", navRoutes.MAKE_ARTICLE],
        ["Mon profil", navRoutes.USERPROFILE],
        ["Ma liste de surveillance", navRoutes.WATCHLIST],
      ]
    : [
        ["Créer un compte", navRoutes.REGISTER],
        ["Se connecter", navRoutes.LOGIN],
        ["Accueil", "/"],
      ];

  return (
    <footer className="mt-20 bg-slate-950">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            La place de marché où chacun fixe le prix. Enchères classiques, enchères inversées et demandes de devis, sans frais de mise en vente.
          </p>
          <div className="mt-5 flex gap-2">
            <a href="https://github.com/AhmedJguirim/WeeBid-Auctions-marketplace" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white">
              <Github size={17} />
            </a>
            <a href="mailto:jguirimahmed112@gmail.com" aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white">
              <Mail size={17} />
            </a>
          </div>
        </div>
        <FooterColumn title="Explorer" links={explore} />
        <FooterColumn title="Compte" links={account} />
      </div>
      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} WeeBid — projet de fin d'études.</p>
          <p>React · Symfony · Socket.io · MariaDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
