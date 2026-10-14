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
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <ul className="mt-5 space-y-3">
        {links.map(([key, path]) => (
          <li key={path}>
            <Link to={path} className="text-sm text-gray-600 transition hover:text-brand-600">{t(key)}</Link>
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
    <footer className="mt-20 border-t border-gray-300 bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title={t("footer.explore")} links={explore} />
        <FooterColumn title={t("footer.account")} links={account} />
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-gray-900">{t("footer.followUs")}</h4>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-600">{t("footer.about")}</p>
          <div className="mt-4 flex gap-4 text-gray-900">
            <a href="https://github.com/AhmedJguirim/WeeBid-Auctions-marketplace" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-brand-600">
              <Github size={20} strokeWidth={1.75} />
            </a>
            <a href="mailto:jguirimahmed112@gmail.com" aria-label="Email" className="hover:text-brand-600">
              <Mail size={20} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-sm text-gray-600 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} WeeBid — {t("footer.project")}</p>
          <p className="text-gray-500">React · Symfony · Socket.io · MariaDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
