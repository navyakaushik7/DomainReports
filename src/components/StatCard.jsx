import { useLanguage } from "../context/LanguageContext";

const ACCENTS = {
  brand: { bg: "bg-brand-50", text: "text-brand-700", ring: "ring-brand-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100" },
  slate: { bg: "bg-panel-muted", text: "text-heading", ring: "ring-line" },
  sky: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-100" },
};

export default function StatCard({ label, value, icon: Icon, accent = "brand", hint }) {
  const { language } = useLanguage();
  const colors = ACCENTS[accent] || ACCENTS.brand;
  return (
    <div className="rounded-md border border-line bg-panel p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className="tabular mt-2 text-2xl font-extrabold text-heading sm:text-[28px]">
            {value.toLocaleString(language === "hi" ? "hi-IN" : "en-IN")}
          </p>
          {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg} ${colors.text} ring-4 ${colors.ring}`}>
          <Icon size={19} strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}

