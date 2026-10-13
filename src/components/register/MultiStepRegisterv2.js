import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { apiRoutes, navRoutes } from "../../config/routes";
import Api from "../../AxiosInstance";
import AuthLayout from "../ui/AuthLayout";
import Field from "../ui/Field";

const stepFields = [
  ["name", "displayName", "email", "password", "telephone", "birthDate"],
  ["pays", "ville", "rue", "zipcode"],
];

// the rules mirror the constraints of the Symfony entities
const makeValidate = (t) => (v) => {
  const e = {};
  if (!v.name) e.name = t("form.required");
  else if (!/^[a-z ,.'-]+$/i.test(v.name)) e.name = t("register.nameFormat");
  if (!v.displayName) e.displayName = t("form.required");
  else if (v.displayName.length < 5 || v.displayName.length > 15) e.displayName = t("register.displayNameLength");
  if (!v.email) e.email = t("form.required");
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v.email)) e.email = t("register.emailInvalid");
  if (!v.password) e.password = t("form.required");
  else if (v.password.length < 6) e.password = t("register.passwordMin");
  if (!v.telephone) e.telephone = t("form.required");
  else if (!/^[0-9]{8}$/.test(v.telephone)) e.telephone = t("register.phone8");
  if (!v.birthDate) e.birthDate = t("form.required");
  else if (new Date(v.birthDate) > new Date()) e.birthDate = t("form.datePast");
  if (!v.pays) e.pays = t("form.required");
  if (!v.ville) e.ville = t("form.required");
  if (!v.rue) e.rue = t("form.required");
  if (!v.zipcode) e.zipcode = t("form.required");
  else if (!/^[0-9]{4}$/.test(v.zipcode)) e.zipcode = t("register.zip4");
  return e;
};

export default function MultiStepRegister() {
  const { t } = useTranslation();
  const steps = [t("register.step1"), t("register.step2")];
  const currentUser = useSelector((state) => state.user);
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: { name: "", displayName: "", email: "", password: "", telephone: "", birthDate: "", pays: "Tunisie", ville: "", rue: "", zipcode: "" },
    validate: makeValidate(t),
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
        await Api.post("/adresses", { pays: v.pays, ville: v.ville, rue: v.rue, zipcode: v.zipcode, user: `/api/users/${me.data.id}` });
        document.location.href = "/";
      } catch (err) {
        setLoading(false);
        const description = err.response && err.response.data && err.response.data["hydra:description"];
        if (err.response && err.response.status === 409) setError(t("register.emailTaken"));
        else if (err.response && err.response.status === 422) {
          setError(description || t("register.invalid"));
          setStep(0);
        } else setError(t("login.serverError"));
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
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      footer={
        <>
          {t("register.haveAccount")} <Link to={navRoutes.LOGIN} className="font-semibold text-brand-600 hover:underline">{t("footer.login")}</Link>
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
            <Field label={t("form.fullName")} maxLength={100} autoComplete="name" {...fieldProps("name")} />
            <Field label={t("form.username")} maxLength={15} autoComplete="username" {...fieldProps("displayName")} />
            <Field label={t("form.email")} type="email" maxLength={180} autoComplete="email" className="sm:col-span-2" {...fieldProps("email")} />
            <Field label={t("form.password")} type="password" maxLength={128} autoComplete="new-password" {...fieldProps("password")} />
            <Field label={t("form.phone")} inputMode="numeric" maxLength={8} placeholder={t("register.phonePlaceholder")} autoComplete="tel" {...fieldProps("telephone")} />
            <Field label={t("form.birthDate")} type="date" className="sm:col-span-2" {...fieldProps("birthDate")} />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("form.country")} maxLength={60} {...fieldProps("pays")} />
            <Field label={t("form.city")} maxLength={60} autoComplete="address-level2" {...fieldProps("ville")} />
            <Field label={t("form.street")} maxLength={120} autoComplete="street-address" {...fieldProps("rue")} />
            <Field label={t("form.zip")} inputMode="numeric" maxLength={4} placeholder={t("register.zipPlaceholder")} autoComplete="postal-code" {...fieldProps("zipcode")} />
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step === 1 ? (
            <button type="button" onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft size={16} /> {t("common.back")}</button>
          ) : <span />}
          <button type="submit" disabled={loading} className="btn-primary !px-6 !py-3">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {step === 0 ? <>{t("common.next")} <ArrowRight size={16} /></> : t("register.submit")}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
