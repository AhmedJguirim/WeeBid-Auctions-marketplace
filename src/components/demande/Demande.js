import React from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Check, Search } from "lucide-react";
import Api from "../../AxiosInstance";
import { apiRoutes, navRoutes } from "../../config/routes";
import Socket from "../base/customComponents/Socket";
import Avatar from "../ui/Avatar";
import PageHeader from "../ui/PageHeader";

const Demande = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const myUser = useSelector((state) => state.user);
  const { id } = useParams();

  const [demande, setDemande] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    Api.get(`/demande_devis/${id}`).then((r) => setDemande(r.data)).catch(console.error);
  }, [id]);

  // search among the auctions to attach to the proposal
  React.useEffect(() => {
    if (!input.trim() || (selected && selected.name === input)) {
      setOptions([]);
      return undefined;
    }
    const t = setTimeout(() => {
      axios
        .get(`${apiRoutes.API}/encheres/search`, { params: { page: "1", "article.name": input } })
        .then((r) => setOptions(r.data["hydra:member"].map((v) => ({ id: v.id, iri: `/api/encheres/${v.id}`, name: v.article.name }))))
        .catch(console.log);
    }, 250);
    return () => clearTimeout(t);
  }, [input, selected]);

  const submit = () => {
    Api.post("/propositions", { enchere: selected.iri, transmitter: `/api/users/${myUser.id}`, transmittedTo: demande.transmitter["@id"] })
      .then((res) => {
        Socket.emit("PROPOSITION", res.data);
        navigate("/");
      })
      .catch(() => setError(t("profile.sendFailed")));
  };

  if (!demande) return <div className="container-page py-10"><div className="h-64 animate-pulse rounded-sm bg-gray-200" /></div>;
  const sender = demande.transmitter;

  return (
    <>
      <PageHeader title={t("quote.title")} subtitle={t("quote.subtitle")} />
      <div className="container-page grid max-w-5xl gap-6 py-8 md:grid-cols-5">
        <div className="card p-6 md:col-span-2">
          <div className="flex items-center gap-4">
            <Avatar name={sender.displayName} image={sender.image} size={64} />
            <div>
              <p className="text-xs text-gray-400">{t("quote.requester")}</p>
              <Link to={`${navRoutes.CONSULTUSER}/${sender.id}`} className="text-lg font-bold text-gray-900 hover:text-brand-700">{sender.displayName}</Link>
            </div>
          </div>
          <dl className="mt-6 space-y-4 border-t border-gray-100 pt-5 text-sm">
            <div>
              <dt className="text-gray-400">{t("quote.quantity")}</dt>
              <dd className="mt-0.5 text-lg font-bold text-gray-900">{demande.quantity}</dd>
            </div>
            <div>
              <dt className="text-gray-400">{t("detail.description")}</dt>
              <dd className="mt-0.5 whitespace-pre-line leading-relaxed text-gray-700">{demande.descriptionArticle}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6 md:col-span-3">
          <h2 className="text-lg font-bold text-gray-900">{t("quote.propose")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("quote.proposeText")}</p>
          <div className="relative mt-5">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input !pl-10"
              placeholder={t("quote.searchPlaceholder")}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setSelected(null);
              }}
            />
            {options.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-2 max-h-60 overflow-auto rounded-sm border border-gray-200 bg-white p-1.5 shadow-lg">
                {options.map((o) => (
                  <li key={o.id}>
                    <button className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-brand-50 hover:text-brand-700" onClick={() => { setSelected(o); setInput(o.name); setOptions([]); }}>
                      {o.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selected && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"><Check size={15} /> {selected.name}</p>
          )}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex justify-end">
            <button disabled={!selected} onClick={submit} className="btn-primary">{t("quote.send")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Demande;
