import { useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import GovtFooter from "../components/GovtFooter";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function DashboardLayout() {
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-surface">
      <Sidebar
        collapsed={sidebarCollapsed}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center bg-panel">
          <button
            type="button"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            aria-label={sidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
            aria-pressed={sidebarCollapsed}
            className="ml-3 hidden h-10 w-10 shrink-0 items-center justify-center rounded-md text-heading hover:bg-panel-muted lg:inline-flex"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label={t("openNavigation")}
            className="ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-heading hover:bg-panel-muted lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <TopNav />
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4 lg:px-5 2xl:px-6">
          <div className="w-full">
            <Outlet />
          </div>
        </main>

        <div className="shrink-0">
          <GovtFooter />
        </div>
      </div>
    </div>
  );
}
