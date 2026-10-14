import * as React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Eye, Gavel, Inbox, LogOut, Menu, Package, Search, Send, User as UserIcon, X } from "lucide-react";
import { navRoutes } from "../../../config/routes";
import Logo from "../../ui/Logo";
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
  `whitespace-nowrap px-3 py-2 text-base transition hover:text-brand-600 ${isActive ? "font-bold text-gray-900" : "text-gray-900"}`;

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
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-base text-gray-900 hover:text-brand-600">
        <UserIcon size={22} strokeWidth={1.75} />
        <span className="hidden max-w-[10rem] truncate lg:block">{user.displayName}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 border border-gray-300 bg-white py-1 shadow-lg">
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500">{t("userMenu.signedInAs")}</p>
            <p className="truncate text-sm font-bold text-gray-900">{user.displayName}</p>
          </div>
          <div className="h-px bg-gray-300" />
          {items.map(({ icon: Icon, text, path }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
              <Icon size={16} strokeWidth={1.75} /> {text}
            </Link>
          ))}
          <div className="h-px bg-gray-300" />
          <Link to={navRoutes.LOGOUT} className="flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
            <LogOut size={16} strokeWidth={1.75} /> {t("userMenu.logout")}
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const location = useLocation();

  // close the menus on navigation
  React.useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* utility bar */}
      <div className="hidden bg-gray-100 sm:block">
        <div className="container-page flex h-10 items-center justify-end gap-4 text-sm text-gray-900">
          <span>{t("nav.tagline")}</span>
          <span className="h-4 w-px bg-gray-400" />
          <LanguageSwitcher />
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-gray-300">
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 lg:h-20">
          <div className="flex items-center gap-3">
            <button className="-ml-2 flex h-10 w-10 items-center justify-center text-gray-900 lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label={t("nav.menu")}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-3 lg:flex">
            {mainLinks.map((l) => (
              <NavLink key={l.path} to={l.path} className={navClass}>{t(l.key)}</NavLink>
            ))}
            {loggedIn && <NavLink to={navRoutes.MAKE_ARTICLE} className={navClass}>{t("nav.sellItem")}</NavLink>}
          </nav>
          <span className="lg:hidden" />

          <div className="flex items-center justify-end gap-5">
            <button onClick={() => setSearchOpen((o) => !o)} className="flex items-center gap-2 text-base text-gray-900 hover:text-brand-600" aria-expanded={searchOpen}>
              <Search size={22} strokeWidth={1.75} /> <span className="hidden md:inline">{t("nav.search")}</span>
            </button>
            {loggedIn ? (
              <>
                <NotificationsMenu />
                <UserMenu user={user} />
              </>
            ) : (
              <Link to={navRoutes.LOGIN} className="flex items-center gap-2 text-base text-gray-900 hover:text-brand-600">
                <UserIcon size={22} strokeWidth={1.75} /> <span className="hidden md:inline">{t("nav.login")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-b border-gray-300 bg-white py-4">
          <div className="container-page"><SearchBar onNavigate={() => setSearchOpen(false)} /></div>
        </div>
      )}

      {mobileOpen && (
        <div className="border-b border-gray-300 bg-white px-4 pb-5 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {mainLinks.map((l) => (
              <NavLink key={l.path} to={l.path} className={navClass}>{t(l.key)}</NavLink>
            ))}
            {loggedIn ? (
              <NavLink to={navRoutes.MAKE_ARTICLE} className={navClass}>{t("nav.sellItem")}</NavLink>
            ) : (
              <>
                <NavLink to={navRoutes.LOGIN} className={navClass}>{t("nav.login")}</NavLink>
                <NavLink to={navRoutes.REGISTER} className={navClass}>{t("nav.register")}</NavLink>
              </>
            )}
          </nav>
          <LanguageSwitcher className="mt-3 sm:hidden" />
        </div>
      )}
    </header>
  );
};

export default TopNavBar;
