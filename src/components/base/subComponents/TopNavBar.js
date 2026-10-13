import * as React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Eye, Gavel, Inbox, LogOut, Menu, Package, PlusCircle, Send, User as UserIcon, X } from "lucide-react";
import { navRoutes } from "../../../config/routes";
import Logo from "../../ui/Logo";
import Avatar from "../../ui/Avatar";
import useClickOutside from "../../ui/useClickOutside";
import SearchBar from "./SearchBar";
import LanguageSwitcher from "../../ui/LanguageSwitcher";
import NotificationsMenu from "../customComponents/NotificationsMenu";

const mainLinks = [
  { key: "nav.auctions", path: navRoutes.ENCHERES },
  { key: "nav.reverseAuctions", path: navRoutes.ENCHERESINVERSES },
  { key: "nav.categories", path: navRoutes.CATEGORIES },
];

const navClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

const UserMenu = ({ user }) => {
  const { t } = useTranslation();
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  useClickOutside(ref, () => setOpen(false));
  const items = [
    { icon: UserIcon, text: t("userMenu.profile"), path: navRoutes.USERPROFILE },
    { icon: Eye, text: t("userMenu.watchlist"), path: navRoutes.WATCHLIST },
    { icon: Gavel, text: t("userMenu.myAuctions"), path: `${navRoutes.ENCHERES}${navRoutes.PERUSER}/${user.id}` },
    { icon: Package, text: t("userMenu.myReverse"), path: `${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${user.id}` },
    { icon: Inbox, text: t("userMenu.quotes"), path: navRoutes.DEMANDESLISTING },
    { icon: Send, text: t("userMenu.proposals"), path: navRoutes.PROPOSITIONSLISTING },
  ];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-slate-100">
        <Avatar name={user.displayName || "?"} size={32} />
        <span className="hidden text-sm font-semibold text-slate-700 xl:block">{user.displayName}</span>
        <ChevronDown size={16} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lift">
          <div className="px-3 py-2">
            <p className="text-xs text-slate-400">{t("userMenu.signedInAs")}</p>
            <p className="truncate text-sm font-bold text-slate-900">{user.displayName}</p>
          </div>
          <div className="my-1 h-px bg-slate-100" />
          {items.map(({ icon: Icon, text, path }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Icon size={16} className="text-slate-400" /> {text}
            </Link>
          ))}
          <div className="my-1 h-px bg-slate-100" />
          <Link to={navRoutes.LOGOUT} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">
            <LogOut size={16} /> {t("userMenu.logout")}
          </Link>
        </div>
      )}
    </div>
  );
};

const TopNavBar = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const loggedIn = user.id !== undefined;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  // close the mobile menu on navigation
  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center gap-3">
        <button className="-ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 xl:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label={t("nav.menu")}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 xl:flex">
          {mainLinks.map((l) => (
            <NavLink key={l.path} to={l.path} className={navClass}>{t(l.key)}</NavLink>
          ))}
        </nav>

        <div className="mx-auto hidden min-w-0 max-w-md flex-1 md:block"><SearchBar /></div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <LanguageSwitcher className="mr-1 hidden sm:inline-flex" />
          {loggedIn ? (
            <>
              <Link to={navRoutes.MAKE_ARTICLE} className="btn-primary hidden !py-2 sm:inline-flex">
                <PlusCircle size={16} /> {t("nav.sell")}
              </Link>
              <NotificationsMenu />
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link to={navRoutes.LOGIN} className="btn-ghost hidden !py-2 sm:inline-flex">{t("nav.login")}</Link>
              <Link to={navRoutes.REGISTER} className="btn-primary !py-2">{t("nav.register")}</Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 xl:hidden">
          <SearchBar className="md:hidden" onNavigate={() => setMobileOpen(false)} />
          <LanguageSwitcher className="mt-3 sm:hidden" />
          <nav className="mt-3 flex flex-col gap-1">
            {mainLinks.map((l) => (
              <NavLink key={l.path} to={l.path} className={navClass}>{t(l.key)}</NavLink>
            ))}
            {loggedIn ? (
              <NavLink to={navRoutes.MAKE_ARTICLE} className={navClass}>{t("nav.sellItem")}</NavLink>
            ) : (
              <NavLink to={navRoutes.LOGIN} className={navClass}>{t("nav.login")}</NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopNavBar;
