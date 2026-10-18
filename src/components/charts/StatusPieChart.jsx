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

const STATUS_COLORS = {
  Active: "#15803D",
  Pending: "#D97706",
  Rejected: "#B91C1C",
  Cancelled: "#64748B",
  Transferred: "#2563EB",
};

export default function StatusPieChart({ data = [] }) {
  const { t } = useLanguage();
  const translatedData = data.map((item) => ({ ...item, originalName: item.name, name: t(String(item.name || "").toLowerCase()) }));
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const hasData = total > 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {t("domainsByStatus")}
      </h2>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        {t("lifecycleShare")}
      </p>

      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={translatedData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={2}
            >
              {translatedData.map((item) => (
                <Cell
                  key={item.name}
                  fill={STATUS_COLORS[item.originalName] || "#64748B"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${Math.round((Number(value) / total) * 100)}%)`,
                name,
              ]}
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
