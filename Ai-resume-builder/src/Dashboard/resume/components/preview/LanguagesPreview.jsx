import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";
import { getLanguageMode, isMonoTone } from "@/lib/resumeTemplates";

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

  const mode = getLanguageMode(variant);
  const mono = isMonoTone(variant);

  const heading = (
    <h2
      className={sectionHeadingClass(variant)}
      style={sectionHeadingStyle(variant, theme)}
    >
      Languages
    </h2>
  );

  if (mode === "inline") {
    return (
      <div className="mt-5">
        {heading}
        <p className={`mt-1.5 text-sm ${mono ? "text-black" : "text-slate-700"}`}>
          {items
            .map((l) => {
              const name = titleCase(l.name);
              const level = String(l.proficiency || "").trim();
              return level ? `${name} (${titleCase(level)})` : name;
            })
            .join(" · ")}
        </p>
      </div>
    );
  }

  if (mode === "pills") {
    return (
      <div className="mt-5">
        {heading}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {items.map((l, i) => (
            <span
              key={i}
              className="rounded-md border px-2 py-0.5 text-[11px] font-medium"
              style={{
                borderColor: theme,
                color: theme,
                background: `${theme}12`,
              }}
            >
              {titleCase(l.name)}
              {l.proficiency ? ` · ${titleCase(l.proficiency)}` : ""}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // chips
  return (
    <div className="mt-5">
      {heading}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {items.map((l, i) => {
          const name = titleCase(l.name);
          const level = String(l.proficiency || "").trim();
          return (
            <div
              key={i}
              className="inline-flex min-w-[7.5rem] max-w-full flex-col rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
              style={
                mono
                  ? { borderColor: "#cbd5e1", background: "#fff" }
                  : undefined
              }
            >
              <span className="break-words text-sm font-semibold text-slate-900">
                {name}
              </span>
              {level ? (
                <span
                  className="mt-0.5 text-[11px] font-medium"
                  style={mono ? { color: "#334155" } : { color: theme }}
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
