import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  FileBarChart2,
  Globe2,
  Landmark,
  Map,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { fetchReports } from "../utils/api";

const QUICK_LINKS = [
  {
    titleKey: "domainReports",
    descriptionKey: "searchReviewDomains",
    to: "/reports/domains",
    icon: Globe2,
  },
  {
    titleKey: "stateWiseDomainReports",
    descriptionKey: "viewStateTotals",
    to: "/domain-counts",
    icon: Map,
  },
  {
    titleKey: "ministryReports",
    descriptionKey: "reviewMinistries",
    to: "/reports/ministry",
    icon: Landmark,
  },
  {
    titleKey: "departmentReports",
    descriptionKey: "reviewDepartments",
    to: "/reports/department",
    icon: Building2,
  },
  {
    titleKey: "organisationReports",
    descriptionKey: "reviewOrganisations",
    to: "/reports/organisation",
    icon: FileBarChart2,
  },
];

function formatDate(value, language) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const accountName = user?.name?.trim() || "";
  const isAdminAccount = /^(portal\s+)?(administrator|admin)$/i.test(accountName);
  const displayName = isAdminAccount
    ? t("admin")
    : accountName.split(/\s+/)[0] || t("admin");

  useEffect(() => {
    let mounted = true;

    fetchReports({
      status: "Pending",
      per_page: 5,
      sort: "createdDate",
      direction: "desc",
    })
      .then((result) => {
        if (mounted) setPendingRequests(result?.data || []);
      })
      .catch(() => {
        if (mounted) setError(t("recentRequestsError"));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  return (
    <div className="min-w-0 space-y-6">
      <section className="rounded-2xl border border-line bg-panel p-5 shadow-sm sm:p-7">
        <p className="text-sm font-semibold text-brand-700">{t("adminConsole")}</p>
        <h1 className="mt-1 text-2xl font-bold text-heading sm:text-3xl">
          {t("welcomeUser", { name: displayName })}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {t("welcomeDescription")}
        </p>
      </section>

      <section aria-labelledby="quick-access-heading" className="space-y-3">
        <div>
          <h2 id="quick-access-heading" className="text-lg font-bold text-heading">
            {t("quickAccess")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {t("quickAccessDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.map(({ titleKey, descriptionKey, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-w-0 items-start gap-3 rounded-xl border border-line bg-panel p-4 shadow-sm transition-colors hover:border-brand-300 hover:bg-panel-muted"
            >
              <span className="shrink-0 rounded-lg bg-brand-50 p-2.5 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <Icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 text-sm font-bold text-heading">
                  {t(titleKey)}
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                  />
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  {t(descriptionKey)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-panel shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-bold text-heading">
              {t("recentlySubmittedRequests")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {t("latestPendingRequests")}
            </p>
          </div>
          <Link
            to="/reports/domains"
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            {t("openDomainReports")}
          </Link>
        </div>

        {error ? (
          <p role="alert" className="px-5 py-6 text-sm text-amber-800">
            {error}
          </p>
        ) : loading ? (
          <p role="status" className="px-5 py-6 text-sm text-muted">
            {t("loadingRecentRequests")}
          </p>
        ) : pendingRequests.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">
            {t("noPendingRequests")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-panel-muted text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t("domain")}</th>
                  <th className="px-5 py-3 font-semibold">{t("ministry")}</th>
                  <th className="px-5 py-3 font-semibold">{t("stateUt")}</th>
                  <th className="px-5 py-3 font-semibold">{t("submitted")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pendingRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-panel-muted/60">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-heading">
                      {request.domainName || "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {request.ministry || "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {request.state || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">
                      {formatDate(request.createdDate, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
