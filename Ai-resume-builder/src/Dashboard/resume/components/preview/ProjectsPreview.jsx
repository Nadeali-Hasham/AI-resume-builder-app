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

  const linkStyle =
    variant === "ats" ? { color: "#000" } : { color: theme };

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
              <h3
                className="text-sm font-semibold"
                style={subHeadingStyle(variant, theme)}
              >
                {p.name}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                {p.link?.trim() && (
                  <a
                    href={toHref(p.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all underline-offset-2 hover:underline"
                    style={linkStyle}
                  >
                    Live: {displayUrl(p.link)}
                  </a>
                )}
                {p.githubUrl?.trim() && (
                  <a
                    href={toHref(p.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all underline-offset-2 hover:underline"
                    style={linkStyle}
                  >
                    GitHub: {displayUrl(p.githubUrl)}
                  </a>
                )}
              </div>
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
