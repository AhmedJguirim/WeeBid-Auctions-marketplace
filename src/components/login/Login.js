import React from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { apiRoutes, navRoutes } from "../../config/routes";
import AuthLayout from "../ui/AuthLayout";

const Login = () => {
  const { t } = useTranslation();
  const currentUser = useSelector((state) => state.user);
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    axios
      .post(`${apiRoutes.API}/login_check`, { username: email, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh", response.data.refresh_token);
        document.location.href = "/";
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 401) setError(t("login.wrongCredentials"));
        else setError(t("login.serverError"));
      });
  };

  if (currentUser.id !== undefined) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      footer={
        <>
          {t("login.noAccount")}{" "}
          <Link to={navRoutes.REGISTER} className="font-semibold text-brand-600 hover:underline">{t("footer.createAccount")}</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-gray-900">{t("form.email")}</label>
          <input id="email" type="email" required autoComplete="email" className="input" placeholder={t("login.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-gray-900">{t("form.password")}</label>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} required autoComplete="current-password" className="input pr-11" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={t("login.showPassword")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
          {loading && <Loader2 size={16} className="animate-spin" />} {t("footer.login")}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
