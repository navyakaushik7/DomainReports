import FilterBar from "../components/FilterBar";
import DataTable from "../components/DataTable";
import { NODAL_OFFICER_COLUMNS } from "../data/columns";
import { useReportFilters } from "../utils/useReportFilters";
import { exportToExcel, exportToCSV, exportToPDF } from "../utils/exportUtils";
import { useLanguage } from "../context/LanguageContext";

export default function NodalOfficerList() {
  const { t } = useLanguage();
  const { filters, setFilters, rows, total, options, canLoadMore, loadMore, tableSearch, setTableSearch, searchTable, search, reset, loading, error } = useReportFilters();
  const columnKeys = NODAL_OFFICER_COLUMNS.map((c) => c.key);

  const handleExport = (type) => {
    if (type === "excel") exportToExcel(rows, columnKeys, "nodal-officer-report");
    if (type === "csv") exportToCSV(rows, columnKeys, "nodal-officer-report");
    if (type === "pdf") exportToPDF(rows, columnKeys, "nodal-officer-report");
  };

  const handleExportSelected = (selectedRows) => exportToExcel(selectedRows, columnKeys, "nodal-officer-selected");

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
      <DataTable columns={NODAL_OFFICER_COLUMNS} rows={rows} onExportSelected={handleExportSelected} canLoadMore={canLoadMore} onLoadMore={loadMore} loading={loading} remainingRecords={total - rows.length} globalSearchValue={tableSearch} onGlobalSearchChange={setTableSearch} onGlobalSearchCommit={searchTable} />
    </div>
  );
}
