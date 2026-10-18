import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";
import { useLanguage } from "../../context/LanguageContext";

function formatMonth(value, language) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
    month: "short",
    year: "2-digit",
  });
}

export default function MonthlyLineChart({ data = [] }) {
  const { language, t } = useLanguage();
  const hasData = data.some((item) => Number(item.value) > 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        {t("monthlyActivation")}
      </h2>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        {t("activationTrend")}
      </p>

      {!hasData ? (
        <ChartEmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 18, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => formatMonth(value, language)}
              minTickGap={24}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <Tooltip
              labelFormatter={(value) => formatMonth(value, language)}
              formatter={(value) => [`${value} ${t("domains")}`, t("activated")]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #CBD5E1",
                backgroundColor: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={t("activated")}
              stroke="#0F766E"
              strokeWidth={3}
              dot={{ r: 3, fill: "#0F766E" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
