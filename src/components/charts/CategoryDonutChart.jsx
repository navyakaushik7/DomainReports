import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";
import { useLanguage } from "../../context/LanguageContext";

const CATEGORY_COLORS = {
  "Central Govt": "#1D4ED8",
  "State Govt": "#0F766E",
  PSU: "#7C3AED",
  "Autonomous Body": "#0891B2",
  "Statutory Body": "#475569",
};

const FALLBACK_COLORS = ["#1D4ED8", "#0F766E", "#7C3AED", "#0891B2", "#475569"];

export default function CategoryDonutChart({ data = [] }) {
  const { t } = useLanguage();
  const categoryKeys = {
    "Central Govt": "centralGovt",
    "State Govt": "stateGovt",
    PSU: "psu",
    "Autonomous Body": "autonomousBody",
    "Statutory Body": "statutoryBody",
  };
  const chartData = data.map((item) => ({
    ...item,
    originalName: item.name,
    name: categoryKeys[item.name] ? t(categoryKeys[item.name]) : item.name,
  }));
  const hasData = data.some((item) => Number(item.value) > 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {t("organisationCategory")}
      </h2>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        {t("domainsByOrganisationType")}
      </p>

      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={2}
            >
              {chartData.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={
                    CATEGORY_COLORS[item.originalName] ||
                    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} ${t("domains")}`, t("total")]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #CBD5E1",
                backgroundColor: "#fff",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
