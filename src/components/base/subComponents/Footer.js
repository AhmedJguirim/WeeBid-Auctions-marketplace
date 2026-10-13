import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Github, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { navRoutes } from "../../../config/routes";
import Logo from "../../ui/Logo";

const FooterColumn = ({ title, links }) => {
  const { t } = useTranslation();
  return (
  <div>
    <h4 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h4>
    <ul className="mt-4 space-y-2.5">
      {links.map(([key, path]) => (
        <li key={path}>
          <Link to={path} className="text-sm text-slate-400 transition hover:text-white">{t(key)}</Link>
        </li>
      ))}
    </ul>
  </div>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const loggedIn = user.id !== undefined;

  const explore = [
    ["footer.allAuctions", navRoutes.ENCHERES],
    ["nav.reverseAuctions", navRoutes.ENCHERESINVERSES],
    ["nav.categories", navRoutes.CATEGORIES],
  ];
  const account = loggedIn
    ? [
        ["nav.sellItem", navRoutes.MAKE_ARTICLE],
        ["userMenu.profile", navRoutes.USERPROFILE],
        ["userMenu.watchlist", navRoutes.WATCHLIST],
      ]
    : [
        ["footer.createAccount", navRoutes.REGISTER],
        ["footer.login", navRoutes.LOGIN],
        ["footer.home", "/"],
      ];

  return (
    <footer className="mt-20 bg-slate-950">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t("footer.about")}
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
        <FooterColumn title={t("footer.explore")} links={explore} />
        <FooterColumn title={t("footer.account")} links={account} />
      </div>
      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} WeeBid — {t("footer.project")}</p>
          <p>React · Symfony · Socket.io · MariaDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
