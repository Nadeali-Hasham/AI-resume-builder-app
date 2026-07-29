import { getTemplate, isMonoTone } from "@/lib/resumeTemplates";

/** Distinct heading look per template — not just left vs center */
export const sectionHeadingClass = (variant = "classic") => {
  const id = getTemplate(variant).id;

  switch (id) {
    case "ats":
      return "font-bold text-sm uppercase tracking-wide text-left text-black border-b border-black pb-0.5 mb-1";
    case "classic":
      return "font-bold text-xl text-center tracking-tight";
    case "modern":
      return "font-bold text-lg text-left uppercase tracking-wider border-l-4 pl-2";
    case "elegant":
      return "font-semibold text-xl text-left italic tracking-wide pb-1 border-b";
    case "compact":
      return "font-bold text-xs uppercase tracking-[0.14em] text-left mb-1";
    case "executive":
      return "font-bold text-sm uppercase tracking-[0.12em] text-left pb-1 border-b-2";
    case "minimal":
      return "font-medium text-[11px] uppercase tracking-[0.2em] text-left text-slate-500 mb-2";
    case "sidebar":
      return "font-bold text-sm uppercase tracking-wider text-left mb-1";
    default:
      return "font-bold text-xl text-left";
  }
};

export const sectionHeadingStyle = (variant = "classic", themeColor) => {
  const id = getTemplate(variant).id;
  const theme = themeColor || "#0f766e";

  if (isMonoTone(variant) || id === "ats") {
    return { color: "#000000", borderColor: "#000000" };
  }
  if (id === "minimal") {
    return { color: "#64748b", borderColor: "#e2e8f0" };
  }
  if (id === "elegant") {
    return { color: theme, borderColor: `${theme}55` };
  }
  if (id === "modern") {
    return { color: theme, borderColor: theme };
  }
  if (id === "executive" || id === "compact") {
    return { color: theme, borderColor: theme };
  }
  return { color: theme };
};

export const subHeadingStyle = (variant = "classic", themeColor) => {
  if (isMonoTone(variant)) {
    return { color: "#000000" };
  }
  const id = getTemplate(variant).id;
  if (id === "minimal") {
    return { color: "#0f172a" };
  }
  return { color: themeColor || "#0f766e" };
};
