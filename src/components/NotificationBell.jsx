import { useEffect, useRef, useState } from "react";
import { Bell, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchReports } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

const REFRESH_INTERVAL_MS = 30_000;

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationBell() {
  const { language, t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadRequests() {
      try {
        const result = await fetchReports({
          status: "Pending",
          per_page: 5,
          sort: "createdDate",
          direction: "desc",
        });

        if (!mounted) return;
        setRequests(result?.data || []);
        setPendingTotal(Number(result?.meta?.total ?? result?.stats?.total ?? 0));
        setError("");
      } catch {
        if (mounted) setError(t("notificationsError"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    function closeOnOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    }

    loadRequests();
    const intervalId = window.setInterval(loadRequests, REFRESH_INTERVAL_MS);
    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [t]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`${t("liveRequestNotifications")}: ${pendingTotal.toLocaleString(language === "hi" ? "hi-IN" : "en-IN")}`}
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-heading hover:bg-panel-muted"
      >
        <Bell size={19} />
        {pendingTotal > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
            {pendingTotal > 99 ? "99+" : pendingTotal}
          </span>
        )}
      </button>

      {open && (
        <section
          aria-label={t("liveRequestNotifications")}
          className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-panel shadow-xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-heading">
                {t("pendingRequests")}
              </h2>
              <p className="text-xs text-muted">
                {t("liveFromRecords")}
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              {pendingTotal.toLocaleString(language === "hi" ? "hi-IN" : "en-IN")}
            </span>
          </div>

          {error ? (
            <p role="alert" className="px-4 py-4 text-sm text-amber-800">
              {error}
            </p>
          ) : loading ? (
            <p role="status" className="px-4 py-4 text-sm text-muted">
              {t("loadingNotifications")}
            </p>
          ) : requests.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">
              {t("noPendingDomainRequests")}
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-line overflow-y-auto">
              {requests.map((request) => (
                <li key={request.id} className="px-4 py-3">
                  <p className="truncate text-sm font-semibold text-heading">
                    {request.domainName || t("domainRequest")}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {[request.ministry, request.state]
                      .filter(Boolean)
                      .join(" · ") || t("ministryOrStateMissing")}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {t("submitted")} {formatDate(request.createdDate, language) || t("dateUnavailable")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/reports/domains"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-brand-700 hover:bg-panel-muted"
          >
            {t("openDomainReports")} <ExternalLink size={15} />
          </Link>
        </section>
      )}
    </div>
  );
}
