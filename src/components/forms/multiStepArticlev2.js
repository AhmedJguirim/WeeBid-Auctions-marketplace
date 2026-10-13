import * as React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Gavel, ImagePlus, Loader2, TrendingDown, X } from "lucide-react";
import Api from "../../AxiosInstance";
import { navRoutes } from "../../config/routes";
import Field from "../ui/Field";
import PageHeader from "../ui/PageHeader";

const steps = ["L'article", "L'annonce"];
const stepFields = [["name", "state", "localisation", "brand", "codebar", "description", "date"], ["quantity", "initPrice", "category", "startDate", "endDate"]];

const toLocal = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// mirrors the constraints of the Symfony entities
const validate = (v) => {
  const e = {};
  if (!v.name) e.name = "Ce champ est obligatoire";
  else if (v.name.length < 3 || v.name.length > 15) e.name = "Entre 3 et 15 caractères";
  if (!v.localisation) e.localisation = "Ce champ est obligatoire";
  if (v.brand && v.brand.length > 15) e.brand = "15 caractères maximum";
  if (v.description && v.description.length > 255) e.description = "255 caractères maximum";
  if (v.date && new Date(v.date) > new Date()) e.date = "La date doit être dans le passé";
  if (!v.quantity || v.quantity < 1) e.quantity = "Au moins 1";
  if (!v.initPrice || v.initPrice <= 0) e.initPrice = "Doit être positif";
  if (!v.category) e.category = "Choisissez une catégorie";
  if (!v.startDate) e.startDate = "Ce champ est obligatoire";
  else if (new Date(v.startDate) < new Date(Date.now() - 5 * 60000)) e.startDate = "Le début ne peut pas être dans le passé";
  if (!v.endDate) e.endDate = "Ce champ est obligatoire";
  else if (new Date(v.endDate) <= new Date(v.startDate)) e.endDate = "La fin doit être après le début";
  return e;
};

const TypeCard = ({ active, onClick, icon: Icon, title, text }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${active ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
  >
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}>
      <Icon size={20} />
    </span>
    <span>
      <span className="block font-bold text-slate-900">{title}</span>
      <span className="mt-0.5 block text-sm text-slate-500">{text}</span>
    </span>
  </button>
);

export default function CreateArticle() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [step, setStep] = React.useState(0);
  const [type, setType] = React.useState("encheres");
  const [categories, setCategories] = React.useState([]);
  const [files, setFiles] = React.useState([]); // { file, url }
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    Api.get("/categories")
      .then((r) => setCategories(r.data["hydra:member"]))
      .catch(console.error);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "", state: "utilisé", localisation: "", brand: "", codebar: "", description: "", date: "",
      quantity: 1, initPrice: "", category: "",
      startDate: toLocal(Date.now() + 10 * 60000), endDate: toLocal(Date.now() + 3 * 86400000),
    },
    validate,
    onSubmit: async (v) => {
      setLoading(true);
      setError("");
      try {
        const article = await Api.post("/articles", {
          name: v.name,
          state: v.state,
          fabricationDate: v.date ? new Date(v.date) : new Date(),
          localisation: v.localisation,
          codebar: v.codebar,
          brand: v.brand,
          description: v.description,
        });
        await Promise.all(
          files.map(({ file }) => {
            const data = new FormData();
            data.append("file", file, file.name);
            data.append("article", article.data.id);
            return Api.post("documents", data, { headers: { "Content-Type": "multipart/form-data" } });
          })
        );
        const price = parseFloat(v.initPrice);
        const listing = await Api.post(`/${type}`, {
          quantity: parseInt(v.quantity, 10),
          initPrice: price,
          currentPrice: price,
          immediatePrice: price * 2,
          startDate: new Date(v.startDate),
          endDate: new Date(v.endDate),
          category: `/api/categories/${v.category}`,
          article: article.data["@id"],
          user: `/api/users/${user.id}`,
        });
        const inverse = type === "enchere_inverses";
        await Api.post("/surveilles", { user: `/api/users/${user.id}`, [inverse ? "enchereInverse" : "enchere"]: listing.data["@id"] });
        navigate(`${inverse ? navRoutes.ENCHEREINVERSE : navRoutes.ENCHERE}/${listing.data.id}`);
      } catch (err) {
        console.log(err);
        setLoading(false);
        const d = err.response && err.response.data && err.response.data["hydra:description"];
        setError(d ? d : "Une erreur est survenue, veuillez réessayer.");
      }
    },
  });

  const fieldProps = (name) => ({
    id: name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && formik.errors[name],
  });

  const goNext = async () => {
    formik.setTouched(Object.fromEntries(stepFields[0].map((f) => [f, true])), true);
    const errors = await formik.validateForm();
    if (!stepFields[0].some((f) => errors[f])) setStep(1);
  };

  const addFiles = (list) => {
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const room = 4 - files.length;
    if (incoming.length > room) alert("4 images maximum");
    setFiles([...files, ...incoming.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  };

  if (user.id === undefined && !localStorage.getItem("token")) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Connectez-vous pour vendre</h1>
        <p className="mt-2 text-slate-500">Un compte est nécessaire pour publier une annonce.</p>
        <a href={navRoutes.LOGIN} className="btn-primary mt-6">Se connecter</a>
      </div>
    );
  }

  const inverse = type === "enchere_inverses";

  return (
    <>
      <PageHeader title="Publier une annonce" subtitle="Décrivez votre article, choisissez le type d'enchère et fixez le calendrier." />
      <div className="container-page max-w-3xl py-8">
        <ol className="mb-8 flex items-center gap-3">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <li className="flex items-center gap-2.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i < step ? "bg-brand-600 text-white" : i === step ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-slate-200 text-slate-500"}`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </span>
                <span className={`text-sm font-semibold ${i <= step ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
              </li>
              {i < steps.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-brand-600" : "bg-slate-200"}`} />}
            </React.Fragment>
          ))}
        </ol>

        <form
          noValidate
          className="card space-y-6 p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 0) goNext();
            else formik.handleSubmit(e);
          }}
        >
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" /> <span className="whitespace-pre-line">{error}</span>
            </div>
          )}

          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom de l'article" placeholder="Ex : Appareil photo" {...fieldProps("name")} />
                <Field label="État" as="select" {...fieldProps("state")}>
                  <option value="utilisé">Utilisé</option>
                  <option value="neuf">Neuf</option>
                </Field>
                <Field label="Localisation" placeholder="Ex : Tunis" {...fieldProps("localisation")} />
                <Field label="Marque (optionnel)" {...fieldProps("brand")} />
                <Field label="Code barre (optionnel)" {...fieldProps("codebar")} />
                <Field label="Date de fabrication (optionnel)" type="date" {...fieldProps("date")} />
              </div>
              <Field label="Description" as="textarea" rows={5} placeholder="Décrivez l'état, les accessoires fournis…" hint={`${formik.values.description.length}/255`} {...fieldProps("description")} />

              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">Photos <span className="font-normal text-slate-400">(4 maximum)</span></p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {files.map(({ url }, i) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Retirer" className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/70 p-1 text-white opacity-0 transition group-hover:opacity-100">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {files.length < 4 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600">
                      <ImagePlus size={22} />
                      <span className="text-xs font-semibold">Ajouter</span>
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TypeCard active={!inverse} onClick={() => setType("encheres")} icon={Gavel} title="Enchère" text="Je vends : les acheteurs surenchérissent." />
                <TypeCard active={inverse} onClick={() => setType("enchere_inverses")} icon={TrendingDown} title="Enchère inversée" text="Je cherche : les vendeurs baissent leur prix." />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Catégorie" as="select" {...fieldProps("category")}>
                  <option value="">Choisir…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Field>
                <Field label="Quantité" type="number" min="1" {...fieldProps("quantity")} />
                <Field label={inverse ? "Budget maximum (TND)" : "Prix de départ (TND)"} type="number" min="0" step="0.1" {...fieldProps("initPrice")} />
                <span className="hidden sm:block" />
                <Field label="Début" type="datetime-local" {...fieldProps("startDate")} />
                <Field label="Fin" type="datetime-local" {...fieldProps("endDate")} />
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            {step === 1 ? (
              <button type="button" onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft size={16} /> Retour</button>
            ) : <span />}
            <button type="submit" disabled={loading} className="btn-primary !px-6 !py-3">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {step === 0 ? <>Suivant <ArrowRight size={16} /></> : "Publier l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
