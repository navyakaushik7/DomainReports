import { useState } from "react";
import { Sun, Moon, Type } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import NicEmblem from "./NicEmblem";
import { useLanguage } from "../context/LanguageContext";

const SIZES = ["87.5%", "100%", "112.5%"];

function initialSizeIndex() {
  try {
    const preferred = JSON.parse(localStorage.getItem("domainreg_preferences") || "{}").textSize;
    const index = SIZES.indexOf(preferred);
    return index >= 0 ? index : 1;
  } catch {
    return 1;
  }
}

export default function GovtTopBar() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [sizeIdx, setSizeIdx] = useState(initialSizeIndex);

  const applySize = (idx) => {
    const clamped = Math.max(0, Math.min(SIZES.length - 1, idx));
    setSizeIdx(clamped);
    document.documentElement.style.fontSize = SIZES[clamped];
    try {
      const preferences = JSON.parse(localStorage.getItem("domainreg_preferences") || "{}");
      localStorage.setItem("domainreg_preferences", JSON.stringify({ ...preferences, textSize: SIZES[clamped] }));
    } catch {
      localStorage.setItem("domainreg_preferences", JSON.stringify({ textSize: SIZES[clamped] }));
    }
  };

  return (
    <div className="hidden sm:block">
      <div className="flex items-center justify-between gap-3 bg-ink-950 px-4 py-1.5 text-[11px] text-slate-300 lg:px-6">
        <a
          href="#main-content"
          className="rounded px-1.5 py-0.5 focus:bg-brand-600 focus:text-white focus:outline-none"
        >
          {t("skipToMain")}
        </a>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 md:flex">
            <NicEmblem size={14} />
            {t("governmentOfIndia")}
          </span>

          <div className="flex items-center gap-1" aria-label={t("adjustTextSize")}>
            <Type size={12} className="mr-0.5" />
            <button
              type="button"
              onClick={() => applySize(sizeIdx - 1)}
              disabled={sizeIdx === 0}
              className="rounded px-1.5 py-0.5 font-semibold hover:bg-ink-800 hover:text-white disabled:opacity-30"
              aria-label={t("decreaseTextSize")}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => applySize(1)}
              className="rounded px-1.5 py-0.5 font-semibold hover:bg-ink-800 hover:text-white"
              aria-label={t("resetTextSize")}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => applySize(sizeIdx + 1)}
              disabled={sizeIdx === SIZES.length - 1}
              className="rounded px-1.5 py-0.5 font-semibold hover:bg-ink-800 hover:text-white disabled:opacity-30"
              aria-label={t("increaseTextSize")}
            >
              A+
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-ink-800 hover:text-white"
            aria-label={t("toggleDarkMode")}
          >
            {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
            {theme === "dark" ? t("light") : t("dark")}
          </button>
        </div>
      </div>
      <div className="tricolour-strip" />
    </div>
  );
}
