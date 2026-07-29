import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";
import { getSkillMode } from "@/lib/resumeTemplates";

const LEVEL_LABELS = {
  1: "Beginner",
  2: "Familiar",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

const normalizeRating = (rating) =>
  Math.max(1, Math.min(5, Number(rating) || 3));

const SkillPreview = ({ resumeInfo, variant = "classic" }) => {
  const themeColor = resumeInfo?.themeColor || "#0f766e";
  const skills = (resumeInfo?.skills || []).filter((s) => s?.name?.trim());
  if (!skills.length) return null;

  const mode = getSkillMode(variant);

  const heading = (
    <h2
      className={sectionHeadingClass(variant)}
      style={sectionHeadingStyle(variant, themeColor)}
    >
      Skills
    </h2>
  );

  if (mode === "list") {
    return (
      <div className="mt-4 resume-skills-list">
        {heading}
        <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
          {skills
            .map((s) => {
              const level = LEVEL_LABELS[normalizeRating(s.rating)];
              return `${s.name} (${level})`;
            })
            .join(" · ")}
        </p>
      </div>
    );
  }

  if (mode === "pills") {
    return (
      <div className="mt-4 resume-skills-pills">
        {heading}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
              style={{ backgroundColor: themeColor }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "dots") {
    return (
      <div className="mt-4 resume-skills-dots">
        {heading}
        <div className="mt-2 space-y-2">
          {skills.map((skill, index) => {
            const rating = normalizeRating(skill.rating);
            return (
              <div key={index} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-sm text-slate-800">
                  {skill.name}
                </span>
                <span className="flex shrink-0 gap-1" aria-label={LEVEL_LABELS[rating]}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          n <= rating ? themeColor : "transparent",
                        border: `1.5px solid ${themeColor}`,
                      }}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // bars (classic / modern / executive / sidebar)
  return (
    <div className="mt-5 resume-skills-bars">
      {heading}
      <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {skills.map((skill, index) => {
          const rating = normalizeRating(skill.rating);
          const widthPercent = rating * 20;
          const level = LEVEL_LABELS[rating];

          return (
            <div key={index} className="min-w-0">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h3 className="truncate text-sm font-medium text-slate-900">
                  {skill.name}
                </h3>
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  {level}
                </span>
              </div>
              <div
                className="skill-rating-track h-2 w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-100"
                style={{
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <div
                  className="skill-rating-fill h-full rounded-sm"
                  style={{
                    width: `${widthPercent}%`,
                    background: themeColor,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillPreview;
