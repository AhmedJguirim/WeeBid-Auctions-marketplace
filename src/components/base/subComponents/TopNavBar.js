import * as React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Eye, Gavel, Inbox, LogOut, Menu, Package, PlusCircle, Send, User as UserIcon, X } from "lucide-react";
import { navRoutes } from "../../../config/routes";
import Logo from "../../ui/Logo";
import Avatar from "../../ui/Avatar";
import useClickOutside from "../../ui/useClickOutside";
import SearchBar from "./SearchBar";
import NotificationsMenu from "../customComponents/NotificationsMenu";

const mainLinks = [
  { text: "Enchères", path: navRoutes.ENCHERES },
  { text: "Enchères inversées", path: navRoutes.ENCHERESINVERSES },
  { text: "Catégories", path: navRoutes.CATEGORIES },
];

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

const UserMenu = ({ user }) => {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  useClickOutside(ref, () => setOpen(false));
  const items = [
    { icon: UserIcon, text: "Mon profil", path: navRoutes.USERPROFILE },
    { icon: Eye, text: "Ma liste de surveillance", path: navRoutes.WATCHLIST },
    { icon: Gavel, text: "Mes enchères", path: `${navRoutes.ENCHERES}${navRoutes.PERUSER}/${user.id}` },
    { icon: Package, text: "Mes enchères inversées", path: `${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${user.id}` },
    { icon: Inbox, text: "Demandes de devis reçues", path: navRoutes.DEMANDESLISTING },
    { icon: Send, text: "Propositions reçues", path: navRoutes.PROPOSITIONSLISTING },
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
            <p className="text-xs text-slate-400">Connecté en tant que</p>
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
            <LogOut size={16} /> Se déconnecter
          </Link>
        </div>
      )}
    </div>
  );
};

const TopNavBar = () => {
  const user = useSelector((state) => state.user);
  const loggedIn = user.id !== undefined;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  // close the mobile menu on navigation
  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center gap-3">
        <button className="-ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {mainLinks.map((l) => (
            <NavLink key={l.path} to={l.path} className={navClass}>{l.text}</NavLink>
          ))}
        </nav>

        <div className="mx-auto hidden max-w-md flex-1 md:block"><SearchBar /></div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          {loggedIn ? (
            <>
              <Link to={navRoutes.MAKE_ARTICLE} className="btn-primary hidden !py-2 sm:inline-flex">
                <PlusCircle size={16} /> Vendre
              </Link>
              <NotificationsMenu />
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link to={navRoutes.LOGIN} className="btn-ghost !py-2">Connexion</Link>
              <Link to={navRoutes.REGISTER} className="btn-primary !py-2">Inscription</Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 lg:hidden">
          <SearchBar className="md:hidden" onNavigate={() => setMobileOpen(false)} />
          <nav className="mt-3 flex flex-col gap-1">
            {mainLinks.map((l) => (
              <NavLink key={l.path} to={l.path} className={navClass}>{l.text}</NavLink>
            ))}
            {loggedIn && (
              <NavLink to={navRoutes.MAKE_ARTICLE} className={navClass}>Vendre un article</NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopNavBar;
