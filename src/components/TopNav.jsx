import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Moon, Settings, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import NicEmblem from "./NicEmblem";
import NotificationBell from "./NotificationBell";

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";
}

export default function TopNav() {
  const { logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const name = t("admin");

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-line bg-panel px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
          <NicEmblem size={30} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-heading sm:text-base">
            {t("domainPortal")}
          </p>
          <p className="text-xs text-muted">{t("governmentOfIndia")}</p>
        </div>
      </div>

      <div className="ml-3 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLanguage}
          className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-heading hover:bg-panel-muted"
            aria-label={language === "en" ? t("switchToHindi") : t("switchToEnglish")}
        >
          {language === "en" ? "हिन्दी" : "English"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
          title={theme === "dark" ? t("switchToLight") : t("switchToDark")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-heading hover:bg-panel-muted"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <NotificationBell />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t("openAccountMenu")}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-panel-muted"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {getInitials(name)}
            </span>

            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-44 truncate text-sm font-semibold text-heading">
                {name}
              </span>
            </span>

            <ChevronDown size={16} className="text-muted" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-line bg-panel py-1 shadow-lg">
              <NavLink
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-heading hover:bg-panel-muted"
              >
                <Settings size={16} />
                {t("settings")}
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-700 hover:bg-panel-muted dark:text-red-300"
              >
                <LogOut size={16} />
                {t("logOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
