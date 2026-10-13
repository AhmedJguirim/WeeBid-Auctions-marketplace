import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRoutes, navRoutes } from "../../../config/routes";
import useClickOutside from "../../ui/useClickOutside";

const types = [
  { value: "/encheres", key: "search.auctions" },
  { value: "/enchere_inverses", key: "search.reverse" },
  { value: "/users", key: "search.members" },
];

// route of the full results page for each type
const searchRoute = {
  "/encheres": navRoutes.ENCHERESEARCH,
  "/enchere_inverses": navRoutes.ENCHEREINVERSESEARCH,
  "/users": navRoutes.USERSEARCH,
};

export default function SearchBar({ className = "", onNavigate }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = React.useRef(null);
  const [type, setType] = React.useState("/encheres");
  const [input, setInput] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const cancelRef = React.useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const toOption = React.useCallback(
    (value) => {
      if (type === "/enchere_inverses") return { id: value.id, link: `${navRoutes.ENCHEREINVERSE}/${value.id}`, name: value.article.name };
      if (type === "/encheres") return { id: value.id, link: `${navRoutes.ENCHERE}/${value.id}`, name: value.article.name };
      return { id: value.id, link: `${navRoutes.CONSULTUSER}/${value.id}`, name: value.displayName };
    },
    [type]
  );

  // debounced search while typing
  React.useEffect(() => {
    if (!input.trim()) {
      setOptions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      if (cancelRef.current) cancelRef.current.cancel();
      cancelRef.current = axios.CancelToken.source();
      setLoading(true);
      try {
        const response = await axios.get(`${apiRoutes.API}${type}/search`, {
          params: type === "/users" ? { page: "1", displayName: input } : { page: "1", "article.name": input },
          cancelToken: cancelRef.current.token,
        });
        setOptions(response["data"]["hydra:member"].map(toOption));
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [input, type, toOption]);

  const go = (link) => {
    setOpen(false);
    setInput("");
    if (onNavigate) onNavigate();
    navigate(link);
  };

  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) go(`${searchRoute[type]}/${encodeURIComponent(input.trim())}`);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={submit} className="flex items-center rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label={t("search.type")}
          className="cursor-pointer rounded-l-xl border-0 bg-transparent py-2.5 pl-3 pr-1 text-sm font-medium text-slate-600 outline-none"
        >
          {types.map((o) => (
            <option key={o.value} value={o.value}>{t(o.key)}</option>
          ))}
        </select>
        <span className="h-5 w-px bg-slate-200" />
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          maxLength={60}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button type="submit" aria-label={t("search.submit")} className="px-3 text-slate-400 hover:text-brand-600">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </form>
      {open && input.trim() && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lift">
          {options.length === 0 && !loading && <li className="px-3 py-2 text-sm text-slate-500">{t("search.noResult")}</li>}
          {options.map((o) => (
            <li key={o.id}>
              <button onClick={() => go(o.link)} className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700">
                {o.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
