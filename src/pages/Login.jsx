import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NicEmblem from "../components/NicEmblem";
import GovtFooter from "../components/GovtFooter";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login({ username, password });
    setSubmitting(false);
    if (!result.ok) {
      setError(t(result.errorKey || "signInFailed"));
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="flex items-center gap-1.5 bg-ink-950 px-4 py-1 text-[11px] text-slate-400 sm:px-6">
        <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
        {t("governmentOfIndia")}
      </div>
      <div className="tricolour-strip" />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-center gap-2.5">
            <NicEmblem size={30} />
            <span className="text-[15px] font-extrabold text-heading">{t("domainReports")}</span>
          </div>

          <div className="rounded-md border border-line bg-panel p-7 sm:p-8">
            <h1 className="mb-1 font-serif text-[26px] font-bold text-heading">{t("signIn")}</h1>
           
            {error && (
              <div className="mb-4 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="username" className="mb-1 flex items-center justify-between text-[13px] font-semibold text-heading">
                {t("emailAddress")}
              </label>
              <input
                id="username"
                type="email"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 w-full rounded-md border border-line-strong bg-panel px-3 py-2.5 text-sm text-heading focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />

              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-semibold text-heading">
                  {t("password")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPassword ? t("hide") : t("show")}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-3 w-full rounded-md border border-line-strong bg-panel px-3 py-2.5 text-sm text-heading focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-ink-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? t("signingIn") : t("signInButton")}
              </button>
            </form>

            <p className="mt-4 border-t border-line pt-3 text-center text-xs text-muted">
              {t("askAdminToEnable")}
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-muted">{t("signInHelp")}</p>
        </div>
      </div>

      <GovtFooter />
    </div>
  );
}
