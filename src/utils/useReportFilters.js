import { useCallback, useEffect, useRef, useState } from "react";
import { fetchReportOptions, searchReports } from "./api";
import { useLanguage } from "../context/LanguageContext";

export const EMPTY_FILTERS = {
  ministry: "",
  state: "",
  department: "",
  organisation: "",
  orgCategory: "",
  status: "",
  dateFrom: "",
  dateTo: "",
  dateExact: "",
};

export function useReportFilters() {
  const { t } = useLanguage();
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const appliedRef = useRef(applied);
  const [tableSearch, setTableSearch] = useState("");
  const [serverPage, setServerPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, rejected: 0, cancelled: 0, transferred: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [options, setOptions] = useState({});

  const loadRows = useCallback(async (filters, page = 1, append = false) => {
    setLoading(true);
    setError("");
    try {
      const result = await searchReports({ ...filters, per_page: 100, page });
      setRows((current) => append ? [...current, ...(result.data || [])] : (result.data || []));
      setServerPage(result.meta?.current_page || page);
      setTotal(result.meta?.total || 0);
      setStats(result.stats || { total: result.meta?.total || 0, active: 0, pending: 0, rejected: 0, cancelled: 0, transferred: 0 });
    } catch (e) {
      setRows([]);
      setTotal(0);
      setStats({ total: 0, active: 0, pending: 0, rejected: 0, cancelled: 0, transferred: 0 });
      setError(t("couldNotLoadReports"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    appliedRef.current = applied;
  }, [applied]);

  useEffect(() => {
    setApplied(EMPTY_FILTERS);
    loadRows(EMPTY_FILTERS);
    fetchReportOptions().then(setOptions).catch(() => setOptions({}));
  }, [loadRows, t]);

  const loadMore = useCallback(() => {
    if (!loading && rows.length < total) loadRows(applied, serverPage + 1, true);
  }, [applied, loadRows, loading, rows.length, serverPage, total]);

  const searchTable = useCallback((query) => {
    const next = { ...appliedRef.current, q: query };
    setApplied(next);
    setServerPage(1);
    loadRows(next);
  }, [loadRows]);

  return {
    filters: draft,
    setFilters: setDraft,
    rows,
    total,
    stats,
    loading,
    error,
    options,
    canLoadMore: rows.length < total,
    loadMore,
    tableSearch,
    setTableSearch,
    searchTable,
    search: () => {
      const next = { ...draft, q: tableSearch };
      setApplied(next);
      setServerPage(1);
      loadRows(next);
    },
    reset: () => {
      setDraft(EMPTY_FILTERS);
      setTableSearch("");
      setApplied(EMPTY_FILTERS);
      setServerPage(1);
      loadRows(EMPTY_FILTERS);
    },
  };
}
