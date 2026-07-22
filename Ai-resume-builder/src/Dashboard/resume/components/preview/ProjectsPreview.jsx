import { displayUrl, toHref } from "@/lib/urlHelpers";
import {
  sectionHeadingClass,
  sectionHeadingStyle,
  subHeadingStyle,
} from "./sectionHeading";

const ProjectsPreview = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";
  const items = resumeInfo?.projects || [];
  if (!items.length) return null;

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Projects
      </h2>
      <div className="mt-2 space-y-3">
        {items.map((p, i) => (
          <div key={i}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold" style={subHeadingStyle(variant, theme)}>
                {p.name}
              </h3>
              {p.link?.trim() && (
                <a
                  href={toHref(p.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] break-all underline-offset-2 hover:underline"
                  style={
                    variant === "ats"
                      ? { color: "#000" }
                      : { color: theme }
                  }
                >
                  {displayUrl(p.link)}
                </a>
              )}
            </div>
            {p.technologies && (
              <p className="text-xs text-slate-600">{p.technologies}</p>
            )}
            {p.description && (
              <p className="mt-0.5 text-sm text-slate-700">{p.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPreview;
