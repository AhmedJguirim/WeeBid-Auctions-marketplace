import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Cake, FileText, Gavel, Inbox, Mail, MapPin, Pencil, Phone, Send, TrendingDown, User as UserIcon, Eye } from "lucide-react";
import Api from "../AxiosInstance";
import { BACKEND_URL } from "../config/env";
import { apiRoutes, navRoutes } from "../config/routes";
import Socket from "./base/customComponents/Socket";
import ProductsListing from "./generalComponents/ProductsListing";
import Avatar from "./ui/Avatar";
import Modal from "./ui/Modal";
import Field from "./ui/Field";

const Stat = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card"><Icon size={18} /></span>
    <div>
      <p className="text-2xl font-extrabold leading-none tabular-nums text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, to }) => (
  <div className="mb-4 flex items-end justify-between">
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    <Link to={to} className="text-sm font-semibold text-brand-600 hover:underline">Voir tout</Link>
  </div>
);

// editable fields of the own profile: label -> API payload key
const editable = {
  nom: { key: "name", label: "Nom complet", icon: UserIcon },
  "nom d'utilisateur": { key: "displayName", label: "Nom d'utilisateur", icon: UserIcon },
  email: { key: "email", label: "Adresse e-mail", icon: Mail },
  téléphone: { key: "telephone", label: "Téléphone", icon: Phone },
  "mot de passe": { key: "password", label: "Mot de passe", icon: Pencil },
};

/**
 * Profile page. `own` shows the connected user's account (with edit actions),
 * otherwise it is the public page of the member `id`.
 */
const ProfileView = ({ id: publicId, own = false }) => {
  const navigate = useNavigate();
  const me = useSelector((state) => state.user);
  const id = own ? me.id : publicId;

  const [data, setData] = React.useState(null);
  const [counts, setCounts] = React.useState({ enchere: 0, inverse: 0 });
  const [encheres, setEncheres] = React.useState([]);
  const [inverses, setInverses] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [value, setValue] = React.useState("");
  const [devis, setDevis] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [description, setDescription] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  const loadUser = React.useCallback(() => {
    const request = own ? Api.get("userdata") : axios.get(`${apiRoutes.API}/users/${publicId}`);
    request.then((res) => setData(res.data)).catch(console.log);
  }, [own, publicId]);

  React.useEffect(() => {
    if (own || publicId) loadUser();
  }, [loadUser, own, publicId]);

  React.useEffect(() => {
    if (id === undefined) return;
    const filter = { user: `/api/users/${id}` };
    const live = { fermeture: null, page: "1", "endDate[after]": new Date(), ...filter };
    axios.get(`${apiRoutes.API}/encheres/getEight`, { params: live }).then((r) => setEncheres(r.data["hydra:member"].slice(0, 4))).catch(console.log);
    axios.get(`${apiRoutes.API}/enchere_inverses/getEight`, { params: live }).then((r) => setInverses(r.data["hydra:member"].slice(0, 4))).catch(console.log);
    axios.get(`${apiRoutes.API}/encheres/pages`, { params: filter }).then((r) => setCounts((c) => ({ ...c, enchere: r.data["hydra:member"].length }))).catch(console.log);
    axios.get(`${apiRoutes.API}/enchere_inverses/pages`, { params: filter }).then((r) => setCounts((c) => ({ ...c, inverse: r.data["hydra:member"].length }))).catch(console.log);
  }, [id]);

  const saveEdit = (e) => {
    e.preventDefault();
    const field = editable[editing];
    const request =
      field.key === "password"
        ? Api.put(`/putPassword/${me.id}`, { password: value })
        : Api.put(`/users/${me.id}`, { [field.key]: value });
    request
      .then(() => {
        setEditing(null);
        loadUser();
      })
      .catch(() => setFeedback("La modification a échoué, vérifiez la valeur saisie."));
  };

  const sendDevis = (e) => {
    e.preventDefault();
    Api.post("/demande_devis", {
      descriptionArticle: description,
      quantity: parseInt(quantity, 10),
      transmitter: `/api/users/${me.id}`,
      transmittedTo: `/api/users/${publicId}`,
    })
      .then((res) => {
        Socket.emit("DEMANDE", res.data, publicId);
        setDevis(false);
        setDescription("");
        setFeedback("Votre demande de devis a été envoyée.");
      })
      .catch(() => setFeedback("L'envoi a échoué, réessayez."));
  };

  if (!data) {
    return <div className="container-page py-10"><div className="h-64 animate-pulse rounded-3xl bg-slate-200" /></div>;
  }

  const avatarSrc = data.avatar ? `${BACKEND_URL}/media/${data.avatar.filePath}` : `${BACKEND_URL}/user/${data.image}`;
  const city = data.adresse && data.adresse[0] && data.adresse[0].ville;
  const rows = own
    ? [
        ["nom", data.name, UserIcon],
        ["nom d'utilisateur", data.displayName, UserIcon],
        ["email", data.email, Mail],
        ["téléphone", data.telephone, Phone],
        ["mot de passe", "••••••••", Pencil],
      ]
    : [];

  return (
    <div className="container-page py-8">
      {feedback && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
          {feedback}
          <button onClick={() => setFeedback("")} className="text-brand-500 hover:text-brand-800">Fermer</button>
        </div>
      )}

      {/* header card */}
      <section className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-900 sm:h-36" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar name={data.displayName} src={avatarSrc} size={104} className="!ring-4" />
              <div className="pb-2 pt-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{data.displayName}</h1>
                <p className="flex items-center gap-3 text-sm text-slate-500">
                  {data.name}
                  {city && <span className="inline-flex items-center gap-1"><MapPin size={13} />{city}</span>}
                </p>
              </div>
            </div>
            {!own && me.id !== undefined && me.id !== Number(publicId) && (
              <button onClick={() => setDevis(true)} className="btn-primary"><FileText size={16} /> Demander un devis</button>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <Stat icon={Gavel} value={counts.enchere} label="enchères créées" />
            <Stat icon={TrendingDown} value={counts.inverse} label="enchères inversées créées" />
          </div>

          {own && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => navigate(navRoutes.WATCHLIST)} className="btn-secondary"><Eye size={16} /> Surveillance</button>
              <button onClick={() => navigate(`${navRoutes.ENCHERES}${navRoutes.PERUSER}/${me.id}`)} className="btn-secondary"><Gavel size={16} /> Mes enchères</button>
              <button onClick={() => navigate(`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${me.id}`)} className="btn-secondary"><TrendingDown size={16} /> Mes inversées</button>
              <button onClick={() => navigate(navRoutes.DEMANDESLISTING)} className="btn-secondary"><Inbox size={16} /> Demandes de devis</button>
              <button onClick={() => navigate(navRoutes.PROPOSITIONSLISTING)} className="btn-secondary"><Send size={16} /> Propositions</button>
            </div>
          )}
        </div>
      </section>

      {/* own account settings */}
      {own && (
        <section className="card mt-6 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Informations du compte</h2>
          <dl className="mt-2 divide-y divide-slate-100">
            {rows.map(([label, val, Icon]) => (
              <div key={label} className="flex items-center gap-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Icon size={16} /></span>
                <div className="min-w-0 flex-1">
                  <dt className="text-xs text-slate-400 first-letter:uppercase">{label}</dt>
                  <dd className="truncate font-semibold text-slate-800">{val}</dd>
                </div>
                <button onClick={() => { setEditing(label); setValue(label === "mot de passe" ? "" : val); setFeedback(""); }} aria-label={`Modifier ${label}`} className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-600">
                  <Pencil size={16} />
                </button>
              </div>
            ))}
            {data.birthDate && (
              <div className="flex items-center gap-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><Cake size={16} /></span>
                <div>
                  <dt className="text-xs text-slate-400">Date de naissance</dt>
                  <dd className="font-semibold text-slate-800">{new Date(data.birthDate).toLocaleDateString("fr-FR")}</dd>
                </div>
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="mt-12">
        <SectionHeader title={own ? "Mes enchères" : `Les enchères de ${data.displayName}`} to={`${navRoutes.ENCHERES}${navRoutes.PERUSER}/${id}`} />
        <ProductsListing ventes={encheres} type={navRoutes.ENCHERE} />
      </section>
      <section className="mt-12">
        <SectionHeader title={own ? "Mes enchères inversées" : `Les enchères inversées de ${data.displayName}`} to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERUSER}/${id}`} />
        <ProductsListing ventes={inverses} type={navRoutes.ENCHEREINVERSE} />
      </section>

      {/* edit a field */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? `Modifier : ${editable[editing].label.toLowerCase()}` : ""}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setEditing(null)}>Annuler</button>
            <button className="btn-primary" form="edit-form" type="submit">Enregistrer</button>
          </>
        }
      >
        <form id="edit-form" onSubmit={saveEdit} className="space-y-3">
          {editing === "email" && <p className="text-xs text-slate-500">Vous devrez vous reconnecter après avoir changé votre adresse e-mail.</p>}
          {editing && (
            <Field
              id="edit"
              label={editable[editing].label}
              type={editing === "mot de passe" ? "password" : editing === "email" ? "email" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              autoFocus
            />
          )}
        </form>
      </Modal>

      {/* quote request (public profile) */}
      <Modal
        open={devis}
        onClose={() => setDevis(false)}
        title={`Demander un devis à ${data.displayName}`}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDevis(false)}>Annuler</button>
            <button className="btn-primary" form="devis-form" type="submit">Envoyer</button>
          </>
        }
      >
        <form id="devis-form" onSubmit={sendDevis} className="space-y-4">
          <Field id="quantity" label="Quantité" type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Field id="description" label="Article recherché" as="textarea" rows={5} required placeholder="Décrivez précisément ce que vous cherchez…" value={description} onChange={(e) => setDescription(e.target.value)} />
        </form>
      </Modal>
    </div>
  );
};

export default ProfileView;
