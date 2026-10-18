import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { NAV_SECTIONS } from "../data/navigation";
import { useLanguage } from "../context/LanguageContext";
import NicEmblem from "./NicEmblem";

export default function Sidebar({ open, onClose, collapsed = false }) {
  const location = useLocation();
  const { t } = useLanguage();

  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(
      NAV_SECTIONS.filter((section) => section.titleKey).map((section) => [
        section.titleKey,
        section.items.some((item) => item.to === location.pathname),
      ])
    )
  );

  useEffect(() => {
    onClose?.();
  }, [location.pathname]);

  function renderLink(item) {
    const Icon = item.icon;
    const label = t(item.labelKey);

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/"}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm lg:transition-[padding,justify-content] ${
            collapsed ? "lg:justify-center lg:px-2" : ""
          } ${
            isActive
              ? "bg-blue-700 font-semibold text-white"
              : "text-slate-200 hover:bg-white/10"
          }`
        }
      >
        {Icon && <Icon size={16} />}
        <span className={collapsed ? "lg:sr-only" : ""}>{label}</span>
      </NavLink>
    );
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={t("closeNavigation")}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 max-w-[85vw] shrink-0 flex-col bg-slate-900 text-white shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:max-w-none lg:translate-x-0 lg:shadow-none lg:transition-[width] lg:duration-200 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex items-center justify-between border-b border-white/10 px-4 py-4 ${
            collapsed ? "lg:justify-center lg:px-2" : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <NicEmblem size={28} />
            <div className={collapsed ? "lg:hidden" : "min-w-0"}>
              <p className="text-sm font-bold">{t("domainReports")}</p>
              <p className="text-xs text-slate-400">{t("adminConsole")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeNavigation")}
            className="rounded p-1.5 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {NAV_SECTIONS.map((section, index) => {
            if (!section.titleKey) {
              return (
                <div key={`section-${index}`} className="py-1">
                  {section.items.map(renderLink)}
                </div>
              );
            }

            const SectionIcon = section.icon;
            const title = t(section.titleKey);
            const isOpen = expanded[section.titleKey];

            if (collapsed) {
              return (
                <section key={section.titleKey} className="space-y-1 py-1">
                  {section.items.map(renderLink)}
                </section>
              );
            }

            return (
              <section key={section.titleKey} className="py-1">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setExpanded((current) => ({
                      ...current,
                      [section.titleKey]: !current[section.titleKey],
                    }))
                  }
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {SectionIcon && <SectionIcon size={15} />}
                    {title}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-2">
                    {section.items.map(renderLink)}
                  </div>
                )}
              </section>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
