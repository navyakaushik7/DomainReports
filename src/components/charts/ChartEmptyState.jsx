import { useLanguage } from "../../context/LanguageContext";

export default function ChartEmptyState() {
  const { t } = useLanguage();
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg bg-slate-50 text-center dark:bg-slate-800/60">
      <div>
        <p className="font-semibold text-slate-700 dark:text-slate-200">
          {t("noDomainData")}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("adjustFilters")}
        </p>
      </div>
    </div>
  );
}
