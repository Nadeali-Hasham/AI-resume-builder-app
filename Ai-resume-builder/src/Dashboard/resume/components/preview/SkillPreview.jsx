import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";

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

  if (variant === "ats") {
    return (
      <div className="mt-4">
        <h2
          className={sectionHeadingClass(variant)}
          style={sectionHeadingStyle(variant, themeColor)}
        >
          Skills
        </h2>
        <p className="mt-1 text-sm text-black">
          {skills
            .map((s) => {
              const level = LEVEL_LABELS[normalizeRating(s.rating)];
              return `${s.name} (${level})`;
            })
            .join(", ")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, themeColor)}
      >
        Skills
      </h2>

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
