import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useLanguage } from "./context/LanguageContext";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DomainReports = lazy(() => import("./pages/DomainReports"));
const NodalOfficerList = lazy(() => import("./pages/NodalOfficerList"));
const MinistryReports = lazy(() => import("./pages/MinistryReports"));
const DepartmentReports = lazy(() => import("./pages/DepartmentReports"));
const OrganisationReports = lazy(() => import("./pages/OrganisationReports"));
const DomainCounts = lazy(() => import("./pages/DomainCounts"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));

function PageLoading() {
  const { t } = useLanguage();
  return <div role="status" className="p-8 text-center text-sm text-muted">{t("loading")}</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports/domains" element={<DomainReports />} />
          <Route path="/reports/nodal-officer" element={<NodalOfficerList />} />
          <Route path="/reports/ministry" element={<MinistryReports />} />
          <Route path="/reports/department" element={<DepartmentReports />} />
          <Route path="/reports/organisation" element={<OrganisationReports />} />
          <Route path="/domain-counts" element={<DomainCounts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
