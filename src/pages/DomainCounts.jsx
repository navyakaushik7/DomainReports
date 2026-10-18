import { useEffect, useState } from "react";
import {
  Globe2,
  CheckCircle2,
  Clock3,
  XCircle,
  Ban,
  ArrowLeftRight,
} from "lucide-react";
import { fetchReportSummary } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

const EMPTY_SUMMARY = {
  stats: {
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    cancelled: 0,
    transferred: 0,
  },
  byState: [],
  byMinistry: [],
};

const STAT_CARDS = [
  { key: "total", labelKey: "totalDomains", icon: Globe2 },
  { key: "active", labelKey: "active", icon: CheckCircle2 },
  { key: "pending", labelKey: "pending", icon: Clock3 },
  { key: "rejected", labelKey: "rejected", icon: XCircle },
  { key: "cancelled", labelKey: "cancelled", icon: Ban },
  { key: "transferred", labelKey: "transferred", icon: ArrowLeftRight },
];

export default function DomainCounts() {
  const { t, language } = useLanguage();
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetchReportSummary()
      .then((result) => {
        if (!mounted) return;
        setSummary({
          ...EMPTY_SUMMARY,
          ...result,
          stats: { ...EMPTY_SUMMARY.stats, ...(result?.stats || {}) },
          byState: result?.byState || [],
          byMinistry: result?.byMinistry || [],
        });
      })
      .catch(() => {
        if (mounted) {
          setError(t("domainCountsError"));
        }
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  const max = Math.max(
    ...summary.byState.map((row) => Number(row.value) || 0),
    ...summary.byMinistry.map((row) => Number(row.value) || 0),
    1
  );

  return (
    <div className="space-y-6">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {error}
        </p>
      )}

      <section
        aria-label={t("domainCountsByStatus")}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
      >
        {STAT_CARDS.map(({ key, labelKey, icon: Icon }) => (
          <article
            key={key}
            className="min-w-0 rounded-xl border border-line bg-panel p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 text-sm font-medium text-muted">
                {t(labelKey)}
              </span>
              <span className="shrink-0 rounded-lg bg-brand-50 p-2 text-brand-700">
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 break-words text-2xl font-bold tabular text-heading">
              {Number(summary.stats[key] || 0).toLocaleString(language === "hi" ? "hi-IN" : "en-IN")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CountCard
          title={t("domainCountByState")}
          emptyLabel={t("noDomainRecords")}
          rows={summary.byState}
          max={max}
          language={language}
        />
        <CountCard
          title={t("domainCountByMinistry")}
          emptyLabel={t("noDomainRecords")}
          rows={summary.byMinistry}
          max={max}
          language={language}
        />
      </section>
    </div>
  );
}

function CountCard({ title, emptyLabel, rows, max, language }) {
  return (
    <section className="min-w-0 rounded-xl border border-line bg-panel p-4 sm:p-5">
      <h2 className="mb-4 text-base font-bold text-heading">{title}</h2>

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="py-5 text-center text-sm text-muted">
            {emptyLabel}
          </p>
        )}

        {rows.map((row) => {
          const value = Number(row.value) || 0;

          return (
            <div key={row.name} className="flex min-w-0 items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs text-muted sm:w-40">
                {row.name}
              </span>
              <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-panel-muted">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs font-semibold tabular text-heading">
                {value.toLocaleString(language === "hi" ? "hi-IN" : "en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
