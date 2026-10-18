import {
  LayoutDashboard,
  FileBarChart2,
  Globe2,
  Building2,
  Landmark,
  Layers,
  Map,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    items: [{ labelKey: "dashboard", to: "/", icon: LayoutDashboard }],
  },
  {
    titleKey: "domainManagement",
    icon: Globe2,
    items: [
      { labelKey: "domainReports", to: "/reports/domains", icon: Globe2 },
      {
        labelKey: "stateWiseDomainReports",
        to: "/domain-counts",
        icon: Map,
      },
    ],
  },
  {
    titleKey: "reports",
    icon: FileBarChart2,
    items: [
      { labelKey: "ministryReports", to: "/reports/ministry", icon: Landmark },
      { labelKey: "departmentReports", to: "/reports/department", icon: Building2 },
      {
        labelKey: "organisationReports",
        to: "/reports/organisation",
        icon: Layers,
      },
    ],
  },
];
