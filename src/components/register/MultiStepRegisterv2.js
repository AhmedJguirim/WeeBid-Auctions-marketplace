import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { apiRoutes, navRoutes } from "../../config/routes";
import AuthLayout from "../ui/AuthLayout";
import Field from "../ui/Field";

const steps = ["Votre compte", "Votre adresse"];
const stepFields = [
  ["name", "displayName", "email", "password", "telephone", "birthDate"],
  ["pays", "ville", "rue", "zipcode"],
];

// the rules mirror the constraints of the Symfony entities
const validate = (v) => {
  const e = {};
  if (!v.name) e.name = "Ce champ est obligatoire";
  else if (!/^[a-z ,.'-]+$/i.test(v.name)) e.name = "Lettres et espaces uniquement";
  if (!v.displayName) e.displayName = "Ce champ est obligatoire";
  else if (v.displayName.length < 5 || v.displayName.length > 15) e.displayName = "Entre 5 et 15 caractères";
  if (!v.email) e.email = "Ce champ est obligatoire";
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v.email)) e.email = "Adresse e-mail invalide";
  if (!v.password) e.password = "Ce champ est obligatoire";
  else if (v.password.length < 6) e.password = "6 caractères minimum";
  if (!v.telephone) e.telephone = "Ce champ est obligatoire";
  else if (!/^[0-9]{8}$/.test(v.telephone)) e.telephone = "Exactement 8 chiffres";
  if (!v.birthDate) e.birthDate = "Ce champ est obligatoire";
  else if (new Date(v.birthDate) > new Date()) e.birthDate = "La date doit être dans le passé";
  if (!v.pays) e.pays = "Ce champ est obligatoire";
  if (!v.ville) e.ville = "Ce champ est obligatoire";
  if (!v.rue) e.rue = "Ce champ est obligatoire";
  if (!v.zipcode) e.zipcode = "Ce champ est obligatoire";
  else if (!/^[0-9]{4}$/.test(v.zipcode)) e.zipcode = "Exactement 4 chiffres";
  return e;
};

export default function MultiStepRegister() {
  const currentUser = useSelector((state) => state.user);
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: { name: "", displayName: "", email: "", password: "", telephone: "", birthDate: "", pays: "Tunisie", ville: "", rue: "", zipcode: "" },
    validate,
    onSubmit: async (v) => {
      setError("");
      setLoading(true);
      try {
        await axios.post(`${apiRoutes.API}/register`, {
          name: v.name,
          displayName: v.displayName,
          email: v.email,
          password: v.password,
          telephone: v.telephone,
          isActive: true,
          birthDate: new Date(v.birthDate),
        });
        const login = await axios.post(`${apiRoutes.API}/login_check`, { username: v.email, password: v.password });
        localStorage.setItem("token", login.data.token);
        localStorage.setItem("refresh", login.data.refresh_token);
        const me = await axios.get(`${apiRoutes.API}/userdata`, { headers: { Authorization: `Bearer ${login.data.token}` } });
        await axios.post(`${apiRoutes.API}/adresses`, { pays: v.pays, ville: v.ville, rue: v.rue, zipcode: v.zipcode, user: `/api/users/${me.data.id}` });
        document.location.href = "/";
      } catch (err) {
        setLoading(false);
        const description = err.response && err.response.data && err.response.data["hydra:description"];
        if (err.response && err.response.status === 409) setError("Cette adresse e-mail est déjà inscrite.");
        else if (err.response && err.response.status === 422) {
          setError(description || "Certaines informations sont invalides.");
          setStep(0);
        } else setError("Erreur interne du serveur, veuillez réessayer.");
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

  const next = async () => {
    formik.setTouched(Object.fromEntries(stepFields[0].map((f) => [f, true])), true);
    const errors = await formik.validateForm();
    if (!stepFields[0].some((f) => errors[f])) setStep(1);
  };

  if (currentUser.id !== undefined) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      wide
      title="Créer votre compte"
      subtitle="Rejoignez la communauté : l'inscription est gratuite."
      footer={
        <>
          Déjà inscrit ? <Link to={navRoutes.LOGIN} className="font-semibold text-brand-600 hover:underline">Se connecter</Link>
        </>
      }
    >
      {/* stepper */}
      <ol className="mb-8 flex items-center gap-3">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <li className="flex items-center gap-2.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${i < step ? "bg-brand-600 text-white" : i === step ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-slate-200 text-slate-500"}`}>
                {i < step ? <Check size={16} /> : i + 1}
              </span>
              <span className={`text-sm font-semibold ${i <= step ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
            </li>
            {i < steps.length - 1 && <span className={`h-px flex-1 ${i < step ? "bg-brand-600" : "bg-slate-200"}`} />}
          </React.Fragment>
        ))}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 0) next();
          else formik.handleSubmit(e);
        }}
        noValidate
      >
        {error && (
          <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> <span className="whitespace-pre-line">{error}</span>
          </div>
        )}

        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom complet" autoComplete="name" {...fieldProps("name")} />
            <Field label="Nom d'utilisateur" autoComplete="username" {...fieldProps("displayName")} />
            <Field label="Adresse e-mail" type="email" autoComplete="email" className="sm:col-span-2" {...fieldProps("email")} />
            <Field label="Mot de passe" type="password" autoComplete="new-password" {...fieldProps("password")} />
            <Field label="Téléphone" inputMode="numeric" placeholder="8 chiffres" autoComplete="tel" {...fieldProps("telephone")} />
            <Field label="Date de naissance" type="date" className="sm:col-span-2" {...fieldProps("birthDate")} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Pays" {...fieldProps("pays")} />
            <Field label="Ville" autoComplete="address-level2" {...fieldProps("ville")} />
            <Field label="Rue" autoComplete="street-address" {...fieldProps("rue")} />
            <Field label="Code postal" inputMode="numeric" placeholder="4 chiffres" autoComplete="postal-code" {...fieldProps("zipcode")} />
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step === 1 ? (
            <button type="button" onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft size={16} /> Retour</button>
          ) : <span />}
          <button type="submit" disabled={loading} className="btn-primary !px-6 !py-3">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {step === 0 ? <>Suivant <ArrowRight size={16} /></> : "Créer mon compte"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
