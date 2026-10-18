import { Globe2, CheckCircle2, Clock3, XCircle, Ban, ArrowLeftRight } from "lucide-react";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import DataTable from "../components/DataTable";
import { DOMAIN_COLUMNS } from "../data/columns";
import { useReportFilters } from "../utils/useReportFilters";
import { exportToExcel, exportToCSV, exportToPDF } from "../utils/exportUtils";
import { useLanguage } from "../context/LanguageContext";

export default function DomainReports() {
  const { t } = useLanguage();
  const { filters, setFilters, rows, total, stats, options, canLoadMore, loadMore, tableSearch, setTableSearch, searchTable, search, reset, loading, error } = useReportFilters();
  const columnKeys = DOMAIN_COLUMNS.map((c) => c.key);

  const cards = [
    { label: t("totalDomains"), value: stats.total, icon: Globe2, accent: "brand" },
    { label: t("active"), value: stats.active, icon: CheckCircle2, accent: "emerald" },
    { label: t("pending"), value: stats.pending, icon: Clock3, accent: "amber" },
    { label: t("rejected"), value: stats.rejected, icon: XCircle, accent: "rose" },
    { label: t("cancelled"), value: stats.cancelled, icon: Ban, accent: "slate" },
    { label: t("transferred"), value: stats.transferred, icon: ArrowLeftRight, accent: "sky" },
  ];

  const handleExport = (type) => {
    if (type === "excel") exportToExcel(rows, columnKeys, "domain-report");
    if (type === "csv") exportToCSV(rows, columnKeys, "domain-report");
    if (type === "pdf") exportToPDF(rows, columnKeys, "domain-report");
  };

  const handleExportSelected = (selectedRows) => exportToExcel(selectedRows, columnKeys, "domain-report-selected");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

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

      {error && <p role="alert" className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}. {t("apiError")}</p>}

      <DataTable columns={DOMAIN_COLUMNS} rows={rows} onExportSelected={handleExportSelected} canLoadMore={canLoadMore} onLoadMore={loadMore} loading={loading} remainingRecords={total - rows.length} globalSearchValue={tableSearch} onGlobalSearchChange={setTableSearch} onGlobalSearchCommit={searchTable} />
    </div>
  );
}
