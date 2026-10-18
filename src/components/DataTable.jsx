import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpDown, ArrowUp, ArrowDown, Search, Columns3, ChevronLeft, ChevronRight, Download,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useLanguage } from "../context/LanguageContext";

const PAGE_SIZES = [10, 25, 50, 100];

export default function DataTable({ columns, rows, onExportSelected, canLoadMore = false, onLoadMore, loading = false, remainingRecords = 0, globalSearchValue, onGlobalSearchChange, onGlobalSearchCommit }) {
  const { t, language } = useLanguage();
  const formatNumber = (value) => Number(value || 0).toLocaleString(language === "hi" ? "hi-IN" : "en-IN");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [localSearch, setLocalSearch] = useState("");
  const globalSearch = globalSearchValue ?? localSearch;
  const firstSearchEffect = useRef(true);
  const [columnFilters, setColumnFilters] = useState({});
  const [visibleCols, setVisibleCols] = useState(() => Object.fromEntries(columns.map((c) => [c.key, true])));
  const [showColMenu, setShowColMenu] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    try {
      const preferred = Number(JSON.parse(localStorage.getItem("domainreg_preferences") || "{}").pageSize);
      return PAGE_SIZES.includes(preferred) ? preferred : 10;
    } catch {
      return 10;
    }
  });

  useEffect(() => {
    if (!onGlobalSearchCommit) return undefined;
    if (firstSearchEffect.current) {
      firstSearchEffect.current = false;
      return undefined;
    }
    const timer = window.setTimeout(() => onGlobalSearchCommit(globalSearch), 350);
    return () => window.clearTimeout(timer);
  }, [globalSearch, onGlobalSearchCommit]);

  const displayColumns = columns.map((column) => ({
    ...column,
    label: t(column.labelKey || column.label),
  }));
  const activeColumns = displayColumns.filter((c) => visibleCols[c.key]);

  const filtered = useMemo(() => {
    let out = rows;
    if (globalSearch.trim()) {
      const q = globalSearch.trim().toLowerCase();
      out = out.filter((row) => columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q)));
    }
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (val?.trim()) {
        out = out.filter((row) => String(row[key] ?? "").toLowerCase().includes(val.trim().toLowerCase()));
      }
    });
    return out;
  }, [rows, columns, globalSearch, columnFilters]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePageAll = () => {
    const allSelected = pageRows.every((r) => selected.has(r.id));
    setSelected((prev) => {
      const next = new Set(prev);
      pageRows.forEach((r) => (allSelected ? next.delete(r.id) : next.add(r.id)));
      return next;
    });
  };

  const selectedRows = rows.filter((r) => selected.has(r.id));

  return (
    <div className="rounded-md border border-line bg-panel">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-line bg-panel-muted px-3 py-2">
          <Search size={15} className="text-faint" />
          <input
            value={globalSearch}
            onChange={(e) => {
              if (globalSearchValue === undefined) setLocalSearch(e.target.value);
              else onGlobalSearchChange?.(e.target.value);
              setPage(1);
            }}
            placeholder={t("searchAllColumns")}
            className="w-full bg-transparent text-sm text-heading placeholder:text-faint focus:outline-none"
          />
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
            {formatNumber(selectedRows.length)} {t("selected")}
            <button
              type="button"
              onClick={() => onExportSelected(selectedRows)}
              className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Download size={12} /> {t("exportSelected")}
            </button>
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColMenu((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel px-3 py-2 text-sm font-medium text-muted hover:bg-panel-muted"
          >
            <Columns3 size={15} /> {t("columns")}
          </button>
          {showColMenu && (
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-line bg-panel p-2">
              {displayColumns.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-panel-muted">
                  <input
                    type="checkbox"
                    checked={!!visibleCols[c.key]}
                    onChange={() => setVisibleCols((prev) => ({ ...prev, [c.key]: !prev[c.key] }))}
                    className="h-3.5 w-3.5 rounded border-line-strong text-brand-600 focus:ring-brand-500"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-ink-800">
            <tr>
              <th className="w-10 border-b border-ink-700 px-3 py-3">
                <input
                  type="checkbox"
                  checked={pageRows.length > 0 && pageRows.every((r) => selected.has(r.id))}
                  onChange={togglePageAll}
                  className="h-3.5 w-3.5 rounded border-line-strong"
                />
              </th>
              {activeColumns.map((c) => (
                <th key={c.key} className="whitespace-nowrap border-b border-ink-700 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <button type="button" onClick={() => toggleSort(c.key)} className="flex items-center gap-1 hover:text-white">
                    {c.label}
                    {sort.key === c.key ? (
                      sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : (
                      <ArrowUpDown size={12} className="text-muted" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
            <tr>
              <th className="border-b border-ink-700 bg-ink-700/40 px-3 py-1.5" />
              {activeColumns.map((c) => (
                <th key={c.key} className="border-b border-ink-700 bg-ink-700/40 px-2 py-1.5">
                  <input
                    value={columnFilters[c.key] || ""}
                    onChange={(e) => {
                      setColumnFilters((prev) => ({ ...prev, [c.key]: e.target.value }));
                      setPage(1);
                    }}
                    placeholder={t("filter")}
                    className="w-full rounded border border-ink-600 bg-ink-800 px-2 py-1 text-xs font-normal text-slate-200 placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={activeColumns.length + 1} className="px-4 py-10 text-center text-sm text-faint">
                  {t("noMatchingRecords")}
                </td>
              </tr>
            )}
            {pageRows.map((row, idx) => (
              <tr key={row.id} className={`border-b border-line ${idx % 2 ? "bg-panel-muted/60" : "bg-panel"} hover:bg-brand-50/40`}>
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                    className="h-3.5 w-3.5 rounded border-line-strong text-brand-600 focus:ring-brand-500"
                  />
                </td>
                {activeColumns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-3 py-2.5 text-heading">
                    {c.key === "status" ? <StatusBadge status={row.status} /> : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>{t("rowsPerPage")}</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-line bg-panel px-2 py-1 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="tabular">
            {t("recordsRange", {
              start: formatNumber(sorted.length ? (currentPage - 1) * pageSize + 1 : 0),
              end: formatNumber(Math.min(currentPage * pageSize, sorted.length)),
              total: formatNumber(sorted.length),
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-line p-1.5 text-muted hover:bg-panel-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="tabular px-2 text-sm text-muted">
            {t("page")} {formatNumber(currentPage)} {t("of")} {formatNumber(totalPages)}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-line p-1.5 text-muted hover:bg-panel-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      {canLoadMore && (
        <div className="border-t border-line px-4 py-3 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="rounded-md border border-line-strong bg-panel px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-panel-muted disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? t("loadingRecords") : t("loadNextRecords", { count: formatNumber(Math.min(100, remainingRecords)) })}
          </button>
        </div>
      )}
    </div>
  );
}
