import { useEffect, useState } from "react";
import {
  Accessibility, Check, CircleHelp, RotateCcw, ShieldCheck, SlidersHorizontal, UserRound,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const STORAGE_KEY = "domainreg_preferences";
const TEXT_SIZES = ["87.5%", "100%", "112.5%"];
const PAGE_SIZES = [10, 25, 50, 100];

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-line py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-heading">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Select({ value, onChange, children, label }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={onChange}
      className="min-w-36 rounded-md border border-line-strong bg-panel px-3 py-2 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand-200"
    >
      {children}
    </select>
  );
}

export default function Settings() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const stored = readPreferences();
  const [textSize, setTextSize] = useState(stored.textSize || "100%");
  const [pageSize, setPageSize] = useState(String(stored.pageSize || 10));
  const [contrast, setContrast] = useState(!!stored.highContrast);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = textSize;
    document.documentElement.classList.toggle("high-contrast", contrast);
  }, [textSize, contrast]);

  const save = (event) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      textSize,
      pageSize: Number(pageSize),
      highContrast: contrast,
    }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const reset = () => {
    setTextSize("100%");
    setPageSize("10");
    setContrast(false);
    setTheme("light");
    localStorage.removeItem(STORAGE_KEY);
  };

  const userName = t("admin");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">{t("displayPreferences")}</p>
        </div>
        <p className="text-xs text-faint">{t("preferencesStored")}</p>
      </div>

      <form onSubmit={save} className="space-y-5">
        <section className="rounded-md border border-line bg-panel" aria-labelledby="display-settings">
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="mt-0.5 rounded-md bg-brand-50 p-2 text-brand-700"><Accessibility size={17} /></div>
            <div>
              <h2 id="display-settings" className="text-sm font-bold text-heading">{t("displayAccessibility")}</h2>
              <p className="mt-0.5 text-xs text-muted">{t("displayAccessibilityDescription")}</p>
            </div>
          </div>
          <div className="px-5">
            <SettingRow title={t("colourAppearance")} description={t("useLightDark")}>
              <Select label={t("colourAppearance")} value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">{t("light")}</option><option value="dark">{t("dark")}</option>
              </Select>
            </SettingRow>
            <SettingRow title={t("textSize")} description={t("textSizeDescription")}>
              <Select label={t("textSize")} value={textSize} onChange={(e) => setTextSize(e.target.value)}>
                <option value="87.5%">{t("smaller")}</option><option value="100%">{t("standard")}</option><option value="112.5%">{t("larger")}</option>
              </Select>
            </SettingRow>
            <SettingRow title={t("highContrast")} description={t("highContrastDescription")}>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-heading">
                <input type="checkbox" checked={contrast} onChange={(e) => setContrast(e.target.checked)} className="h-4 w-4 rounded border-line-strong text-brand-700 focus:ring-brand-500" />
                {t("enable")}
              </label>
            </SettingRow>
          </div>
        </section>

        <section className="rounded-md border border-line bg-panel" aria-labelledby="report-settings">
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="mt-0.5 rounded-md bg-brand-50 p-2 text-brand-700"><SlidersHorizontal size={17} /></div>
            <div>
              <h2 id="report-settings" className="text-sm font-bold text-heading">{t("reportingPreferences")}</h2>
              <p className="mt-0.5 text-xs text-muted">{t("reportingPreferencesDescription")}</p>
            </div>
          </div>
          <div className="px-5">
            <SettingRow title={t("rowsPerPage")} description={t("defaultRowsDescription")}>
              <Select label={t("rowsPerPage")} value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                {PAGE_SIZES.map((size) => <option key={size} value={size}>{size} {t("rows")}</option>)}
              </Select>
            </SettingRow>
          </div>
        </section>

        <section className="rounded-md border border-line bg-panel" aria-labelledby="account-settings">
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="mt-0.5 rounded-md bg-brand-50 p-2 text-brand-700"><UserRound size={17} /></div>
            <div>
              <h2 id="account-settings" className="text-sm font-bold text-heading">{t("accountAccess")}</h2>
              <p className="mt-0.5 text-xs text-muted">{t("currentSessionIdentity")}</p>
            </div>
          </div>
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div><p className="text-xs font-medium text-faint">{t("userId")}</p><p className="mt-1 text-sm font-semibold text-heading">{userName}</p></div>
            <div><p className="text-xs font-medium text-faint">{t("assignedRole")}</p><p className="mt-1 text-sm font-semibold text-heading">{t("admin")}</p></div>
          </div>
          <div className="flex gap-2 border-t border-line bg-panel-muted px-5 py-3 text-xs leading-5 text-muted">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-700" />
            <p>{t("accessManagement")}</p>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-panel px-3.5 py-2 text-sm font-semibold text-muted hover:bg-panel-muted">
            <RotateCcw size={15} /> {t("restoreDefaults")}
          </button>
          <div className="flex items-center gap-3">
            {saved && <span role="status" className="inline-flex items-center gap-1 text-sm font-medium text-green-700"><Check size={15} /> {t("saved")}</span>}
            <button type="submit" className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2">{t("savePreferences")}</button>
          </div>
        </div>
      </form>

      <div className="flex gap-2 rounded-md border border-line bg-panel-muted px-4 py-3 text-xs leading-5 text-muted">
        <CircleHelp size={15} className="mt-0.5 shrink-0" />
        <p>{t("settingsHelp")}</p>
      </div>
    </div>
  );
}
