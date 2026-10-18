import { useLanguage } from "../context/LanguageContext";

// Original emblem for this demo portal — a network/connectivity motif
// (nodes + orbits) representing "informatics", not a reproduction of any
// official government seal, state emblem, or real department logo. Swap in
// the actual authorised logo file before this goes anywhere near production.
export default function NicEmblem({ size = 40, className = "", variant = "default" }) {
  const { t } = useLanguage();
  const gold = variant === "gold";
  const ring = gold ? "#d9a441" : "#ff9933";
  const fill = gold ? "#152648" : "#0a4696";
  const orbit = gold ? "#d9a441" : "#ffffff";
  const core = gold ? "#e8c07d" : "#ffffff";
  const dot1 = gold ? "#e8c07d" : "#ff9933";
  const dot2 = gold ? "#d9a441" : "#128807";
  const dot3 = gold ? "#f2d9a6" : "#ffffff";

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={t("adminEmblem")}
    >
      <circle cx="24" cy="24" r="22" fill={fill} />
      <circle cx="24" cy="24" r="22" fill="none" stroke={ring} strokeWidth={gold ? 1.75 : 1.5} opacity={gold ? 1 : 0.85} />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke={ring} strokeWidth="0.75" opacity="0.5" />
      <ellipse cx="24" cy="24" rx="16" ry="7" fill="none" stroke={orbit} strokeWidth="1.3" opacity={gold ? 0.75 : 0.55} />
      <ellipse cx="24" cy="24" rx="16" ry="7" fill="none" stroke={orbit} strokeWidth="1.3" opacity={gold ? 0.75 : 0.55} transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="16" ry="7" fill="none" stroke={orbit} strokeWidth="1.3" opacity={gold ? 0.75 : 0.55} transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="3.6" fill={core} />
      <circle cx="24" cy="8" r="1.8" fill={dot1} />
      <circle cx="8" cy="30" r="1.8" fill={dot2} />
      <circle cx="40" cy="30" r="1.8" fill={dot3} />
    </svg>
  );
}
