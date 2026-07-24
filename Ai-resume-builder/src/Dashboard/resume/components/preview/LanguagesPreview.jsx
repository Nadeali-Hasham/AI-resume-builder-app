import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";

const titleCase = (value) => {
  const s = String(value || "").trim();
  if (!s) return "";
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const LanguagesPreview = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";
  const items = (resumeInfo?.languages || []).filter((l) => l?.name?.trim());
  if (!items.length) return null;

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Languages
      </h2>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {items.map((l, i) => {
          const name = titleCase(l.name);
          const level = String(l.proficiency || "").trim();
          return (
            <div
              key={i}
              className="inline-flex min-w-[7.5rem] flex-col rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
              style={
                variant === "ats"
                  ? { borderColor: "#cbd5e1", background: "#fff" }
                  : undefined
              }
            >
              <span className="text-sm font-semibold text-slate-900">{name}</span>
              {level ? (
                <span
                  className="mt-0.5 text-[11px] font-medium"
                  style={
                    variant === "ats" ? { color: "#334155" } : { color: theme }
                  }
                >
                  {titleCase(level)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguagesPreview;
