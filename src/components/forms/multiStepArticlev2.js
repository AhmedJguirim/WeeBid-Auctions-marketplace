import * as React from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Gavel, ImagePlus, Loader2, TrendingDown, X } from "lucide-react";
import Api from "../../AxiosInstance";
import { navRoutes } from "../../config/routes";
import Field from "../ui/Field";
import PageHeader from "../ui/PageHeader";

const stepFields = [["name", "state", "localisation", "brand", "codebar", "description", "date"], ["quantity", "initPrice", "category", "startDate", "endDate"]];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // same limit as the server

const toLocal = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// mirrors the constraints of the Symfony entities
const makeValidate = (t) => (v) => {
  const e = {};
  if (!v.name) e.name = t("form.required");
  else if (v.name.length < 3 || v.name.length > 15) e.name = t("create.name3_15");
  if (!v.localisation) e.localisation = t("form.required");
  if (v.brand && v.brand.length > 15) e.brand = t("create.max15");
  if (v.description && v.description.length > 255) e.description = t("create.max255");
  if (v.date && new Date(v.date) > new Date()) e.date = t("form.datePast");
  if (!v.quantity || v.quantity < 1) e.quantity = t("create.atLeast1");
  if (!v.initPrice || v.initPrice <= 0) e.initPrice = t("create.positive");
  if (!v.category) e.category = t("create.chooseCategory");
  if (!v.startDate) e.startDate = t("form.required");
  else if (new Date(v.startDate) < new Date(Date.now() - 5 * 60000)) e.startDate = t("create.startPast");
  if (!v.endDate) e.endDate = t("form.required");
  else if (new Date(v.endDate) <= new Date(v.startDate)) e.endDate = t("create.endAfterStart");
  return e;
};

const TypeCard = ({ active, onClick, icon: Icon, title, text }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-start gap-3 rounded-sm border-2 p-4 text-left transition ${active ? "border-brand-600 bg-brand-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
  >
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"}`}>
      <Icon size={20} />
    </span>
    <span>
      <span className="block font-bold text-gray-900">{title}</span>
      <span className="mt-0.5 block text-sm text-gray-500">{text}</span>
    </span>
  </button>
);

export default function CreateArticle() {
  const { t } = useTranslation();
  const steps = [t("create.step1"), t("create.step2")];
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
    validate: makeValidate(t),
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
        setError(d ? d : t("create.error"));
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
    const all = Array.from(list);
    if (all.some((f) => !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type))) alert(t("create.fileType"));
    if (all.some((f) => f.size > MAX_IMAGE_BYTES)) alert(t("create.fileTooBig"));
    const incoming = all.filter((f) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type) && f.size <= MAX_IMAGE_BYTES);
    const room = 4 - files.length;
    if (incoming.length > room) alert(t("create.max4"));
    setFiles([...files, ...incoming.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  };

  if (user.id === undefined && !localStorage.getItem("token")) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t("create.loginTitle")}</h1>
        <p className="mt-2 text-gray-500">{t("create.loginText")}</p>
        <a href={navRoutes.LOGIN} className="btn-primary mt-6">{t("footer.login")}</a>
      </div>
    );
  }

  const inverse = type === "enchere_inverses";

  return (
    <>
      <PageHeader title={t("create.title")} subtitle={t("create.subtitle")} />
      <div className="container-page max-w-3xl py-8">
        <ol className="mb-8 flex items-center gap-3">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <li className="flex items-center gap-2.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i < step ? "bg-brand-600 text-white" : i === step ? "bg-brand-600 text-white ring-2 ring-brand-100" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </span>
                <span className={`text-sm font-semibold ${i <= step ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
              </li>
              {i < steps.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-brand-600" : "bg-gray-200"}`} />}
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
            <div role="alert" className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" /> <span className="whitespace-pre-line">{error}</span>
            </div>
          )}

          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("create.name")} placeholder={t("create.namePlaceholder")} maxLength={15} {...fieldProps("name")} />
                <Field label={t("detail.state")} as="select" {...fieldProps("state")}>
                  <option value="utilisé">{t("state.utilisé")}</option>
                  <option value="neuf">{t("state.neuf")}</option>
                </Field>
                <Field label={t("detail.location")} placeholder={t("create.locationPlaceholder")} maxLength={100} {...fieldProps("localisation")} />
                <Field label={`${t("detail.brand")} ${t("create.optional")}`} maxLength={15} {...fieldProps("brand")} />
                <Field label={`${t("detail.barcode")} ${t("create.optional")}`} maxLength={50} {...fieldProps("codebar")} />
                <Field label={`${t("detail.manufactured")} ${t("create.optional")}`} type="date" {...fieldProps("date")} />
              </div>
              <Field label={t("detail.description")} as="textarea" rows={5} maxLength={255} placeholder={t("create.descriptionPlaceholder")} hint={`${formik.values.description.length}/255`} {...fieldProps("description")} />

              <div>
                <p className="mb-1.5 text-sm font-bold text-gray-900">{t("create.photos")} <span className="font-normal text-gray-400">{t("create.photosMax")}</span></p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {files.map(({ url }, i) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-sm bg-gray-100">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label={t("create.remove")} className="absolute right-1.5 top-1.5 rounded-full bg-gray-900/70 p-1 text-white opacity-0 transition group-hover:opacity-100">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {files.length < 4 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600">
                      <ImagePlus size={22} />
                      <span className="text-xs font-semibold">{t("create.add")}</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TypeCard active={!inverse} onClick={() => setType("encheres")} icon={Gavel} title={t("create.typeAuction")} text={t("create.typeAuctionText")} />
                <TypeCard active={inverse} onClick={() => setType("enchere_inverses")} icon={TrendingDown} title={t("create.typeReverse")} text={t("create.typeReverseText")} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("create.category")} as="select" {...fieldProps("category")}>
                  <option value="">{t("create.choose")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Field>
                <Field label={t("detail.quantity")} type="number" min="1" max="100000" {...fieldProps("quantity")} />
                <Field label={inverse ? t("create.budget") : t("create.startPriceTnd")} type="number" min="0" step="0.1" {...fieldProps("initPrice")} />
                <span className="hidden sm:block" />
                <Field label={t("detail.start")} type="datetime-local" {...fieldProps("startDate")} />
                <Field label={t("detail.end")} type="datetime-local" {...fieldProps("endDate")} />
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-6">
            {step === 1 ? (
              <button type="button" onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft size={16} /> {t("common.back")}</button>
            ) : <span />}
            <button type="submit" disabled={loading} className="btn-primary !px-6 !py-3">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {step === 0 ? <>{t("common.next")} <ArrowRight size={16} /></> : t("create.publish")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
