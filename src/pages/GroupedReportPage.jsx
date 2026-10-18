import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import FilterBar from "../components/FilterBar";
import { STATUSES } from "../data/mockData";
import { useReportFilters } from "../utils/useReportFilters";
import { exportToExcel, exportToCSV, exportToPDF } from "../utils/exportUtils";
import { useLanguage } from "../context/LanguageContext";

const STATUS_COLORS = {
  Active: "#10b981",
  Pending: "#f59e0b",
  Rejected: "#f43f5e",
  Cancelled: "#94a3b8",
  Transferred: "#0ea5e9",
};

export default function GroupedReportPage({ groupKey, groupLabel, filename }) {
  const { t, language } = useLanguage();
  const formatNumber = (value) => Number(value || 0).toLocaleString(language === "hi" ? "hi-IN" : "en-IN");
  const { filters, setFilters, rows, total, options, canLoadMore, loadMore, search, reset, loading, error } = useReportFilters();
  const translatedGroup = t(groupKey === "organisation" ? "organisation" : groupKey);

  const grouped = useMemo(() => {
    const map = new Map();
    rows.forEach((row) => {
      const key = row[groupKey];
      if (!map.has(key)) {
        map.set(key, { name: key, total: 0, Active: 0, Pending: 0, Rejected: 0, Cancelled: 0, Transferred: 0 });
      }
      const bucket = map.get(key);
      bucket.total += 1;
      bucket[row.status] += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [rows, groupKey]);

  const exportRows = grouped.map((g) => ({
    [translatedGroup]: g.name,
    [t("total")]: g.total,
    [t("active")]: g.Active,
    [t("pending")]: g.Pending,
    [t("rejected")]: g.Rejected,
    [t("cancelled")]: g.Cancelled,
    [t("transferred")]: g.Transferred,
  }));
  const exportCols = [translatedGroup, t("total"), t("active"), t("pending"), t("rejected"), t("cancelled"), t("transferred")];

  const handleExport = (type) => {
    if (type === "excel") exportToExcel(exportRows, exportCols, filename);
    if (type === "csv") exportToCSV(exportRows, exportCols, filename);
    if (type === "pdf") exportToPDF(exportRows, exportCols, filename);
  };

  return (
    <div className="space-y-5">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onSearch={search}
        onReset={reset}
        onExport={handleExport}
        resultCount={total}
        loading={loading}
        options={options}
        exportReady={!canLoadMore}
      />
      {error && <p role="alert" className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error} {t("apiError")}</p>}

      <div className="rounded-md border border-line bg-panel p-4 sm:p-5">
        <h3 className="text-sm font-bold text-heading">{t("domainStatusByGroup", { group: translatedGroup })}</h3>
        <p className="mb-2 text-xs text-faint">{t("stackedBreakdown")}</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={grouped} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
           <XAxis
  dataKey="name"
  interval={0}
  angle={0}
  height={48}
  tick={{ fontSize: 11, fill: "#64748b" }}
  tickFormatter={(name) => name.replace(/^Department of\s*/i, "")}
/>  
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
            <Tooltip
  shared={false}
  cursor={false}
  contentStyle={{
    borderRadius: 8,
    borderColor: "var(--color-line)",
    backgroundColor: "var(--color-panel)",
    color: "var(--color-heading)",
    fontSize: 12,
  }}
/>
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {STATUSES.map((s) => (
              <Bar key={s} dataKey={s} name={t(s.toLowerCase())} stackId="a" fill={STATUS_COLORS[s]} radius={s === "Transferred" ? [6, 6, 0, 0] : 0} maxBarSize={40} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-panel">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-ink-800">
            <tr>
              {exportCols.map((c) => (
                <th key={c} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grouped.length === 0 && (
              <tr>
                <td colSpan={exportCols.length} className="px-4 py-10 text-center text-sm text-faint">
                  {t("noMatchingRecords")}
                </td>
              </tr>
            )}
            {grouped.map((g, idx) => (
              <tr key={g.name} className={`border-b border-line ${idx % 2 ? "bg-panel-muted/60" : "bg-panel"}`}>
                <td className="px-4 py-2.5 font-medium text-heading">{g.name}</td>
                <td className="tabular px-4 py-2.5 font-semibold text-heading">{formatNumber(g.total)}</td>
                <td className="tabular px-4 py-2.5 text-emerald-700">{formatNumber(g.Active)}</td>
                <td className="tabular px-4 py-2.5 text-amber-700">{formatNumber(g.Pending)}</td>
                <td className="tabular px-4 py-2.5 text-rose-700">{formatNumber(g.Rejected)}</td>
                <td className="tabular px-4 py-2.5 text-muted">{formatNumber(g.Cancelled)}</td>
                <td className="tabular px-4 py-2.5 text-sky-700">{formatNumber(g.Transferred)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {canLoadMore && <div className="text-center"><button type="button" onClick={loadMore} disabled={loading} className="rounded-md border border-line-strong bg-panel px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-panel-muted disabled:opacity-60">{loading ? t("loadingRecords") : t("loadNextRecords", { count: formatNumber(Math.min(100, total - rows.length)) })}</button></div>}
    </div>
  );
}
