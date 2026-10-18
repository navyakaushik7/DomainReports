import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";
import { useLanguage } from "../../context/LanguageContext";

export default function MinistryBarChart({ data = [] }) {
  const { t } = useLanguage();
  const hasData = data.some((item) => Number(item.value) > 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {t("domainsByMinistry")}
      </h2>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        {t("registeredByMinistry")}
      </p>

      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 20, bottom: 4, left: 8 }}
          >
            <CartesianGrid stroke="#E2E8F0" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={155}
              tick={{ fill: "#475569", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [`${value} ${t("domains")}`, t("total")]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #CBD5E1",
                backgroundColor: "#fff",
              }}
            />
            <Bar
              dataKey="value"
              name={t("domains")}
              fill="#1D4ED8"
              radius={[0, 5, 5, 0]}
              maxBarSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
