import { useLanguage } from "../context/LanguageContext";

const STYLES = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  Cancelled: "bg-panel-muted text-muted ring-line",
  Transferred: "bg-sky-50 text-sky-700 ring-sky-200",
};

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  const cls = STYLES[status] || STYLES.Cancelled;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {t(String(status || "cancelled").toLowerCase())}
    </span>
  );
}

