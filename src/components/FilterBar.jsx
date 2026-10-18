import { Search, RotateCcw, FileSpreadsheet, FileText, FileDown, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const FIELD_LABEL_KEYS = {
  ministry: "ministry",
  state: "stateUt",
  department: "department",
  organisation: "organisation",
  orgCategory: "organisationCategory",
  status: "domainStatus",
};

function Select({ field, value, onChange, options, t }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full appearance-none rounded-lg border border-line bg-panel-muted py-2.5 pl-3 pr-8 text-sm text-heading focus:border-brand-500 focus:bg-panel focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        <option value="">{t("all")} {t(FIELD_LABEL_KEYS[field])}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {["Active", "Pending", "Rejected", "Cancelled", "Transferred"].includes(opt)
              ? t(opt.toLowerCase())
              : opt}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-faint" />
    </div>
  );
}

export default function FilterBar({ filters, onChange, onSearch, onReset, onExport, resultCount, loading = false, options = {}, exportReady = true }) {
  const { t, language } = useLanguage();
  const formattedResultCount = Number(resultCount || 0).toLocaleString(language === "hi" ? "hi-IN" : "en-IN");
  const handleField = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="rounded-md border border-line bg-panel p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.keys(FIELD_LABEL_KEYS).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-xs font-semibold text-muted">{t(FIELD_LABEL_KEYS[field])}</label>
            <Select field={field} value={filters[field]} onChange={handleField} options={options[field] || []} t={t} />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">{t("activationDateFrom")}</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleField("dateFrom", e.target.value)}
            className="w-full rounded-lg border border-line bg-panel-muted py-2.5 px-3 text-sm text-heading focus:border-brand-500 focus:bg-panel focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">{t("activationDateTo")}</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleField("dateTo", e.target.value)}
            className="w-full rounded-lg border border-line bg-panel-muted py-2.5 px-3 text-sm text-heading focus:border-brand-500 focus:bg-panel focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted">{t("exactActivationDate")}</label>
          <input
            type="date"
            value={filters.dateExact}
            onChange={(e) => handleField("dateExact", e.target.value)}
            className="w-full rounded-lg border border-line bg-panel-muted py-2.5 px-3 text-sm text-heading focus:border-brand-500 focus:bg-panel focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-sm text-muted">
          <span className="tabular font-semibold text-heading">{formattedResultCount}</span> {t("recordsMatch")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60"
          >
            <Search size={15} /> {loading ? t("loading") : t("search")}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-panel-muted"
          >
            <RotateCcw size={14} /> {t("reset")}
          </button>
          <div className="mx-1 h-6 w-px bg-line" />
          <button
            type="button"
            onClick={() => onExport("excel")}
            disabled={!exportReady || loading}
            title={!exportReady ? t("loadAllBeforeExport") : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={15} /> {t("excel")}
          </button>
          <button
            type="button"
            onClick={() => onExport("csv")}
            disabled={!exportReady || loading}
            title={!exportReady ? t("loadAllBeforeExport") : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileDown size={15} /> {t("csv")}
          </button>
          <button
            type="button"
            onClick={() => onExport("pdf")}
            disabled={!exportReady || loading}
            title={!exportReady ? t("loadAllBeforeExport") : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={15} /> {t("pdf")}
          </button>
        </div>
      </div>
    </div>
  );
}
