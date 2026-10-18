import { useLanguage } from "../context/LanguageContext";

export default function GovtFooter() {
  const { language, t } = useLanguage();
  return (
    <footer className="border-t border-line bg-panel px-4 py-3 text-center text-[11px] leading-relaxed text-faint sm:px-6">
      <p>
        {t("footerMaintained")}
      </p>
      <p>
        {t("lastUpdated")}:{" "}
        {new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p>{t("allRightsReserved")}</p>
    </footer>
  );
}
