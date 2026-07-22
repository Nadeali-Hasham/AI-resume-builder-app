import { sanitizeHtml } from "@/lib/sanitizeHtml";
import {
  sectionHeadingClass,
  sectionHeadingStyle,
  subHeadingStyle,
} from "./sectionHeading";

const ExperiencePreview = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";

  if (!resumeInfo?.experience || resumeInfo.experience.length === 0) {
    return (
      <div className="mt-5">
        <h2
          className={sectionHeadingClass(variant)}
          style={sectionHeadingStyle(variant, theme)}
        >
          Professional Experience
        </h2>
        <p
          className={`text-gray-400 text-sm mt-2 ${
            variant === "classic" ? "text-center" : "text-left"
          }`}
        >
          No experience added yet
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Professional Experience
      </h2>
      {resumeInfo.experience.map((exp, index) => (
        <div key={index} className="py-2">
          <h3
            className="font-semibold"
            style={subHeadingStyle(variant, theme)}
          >
            {exp.title || "Untitled"}
          </h3>
          <p className="text-sm font-medium">{exp.companyName || "Company Name"}</p>
          <div className="flex justify-between text-sm gap-2">
            <p>
              {exp.city || ""}, {exp.state || ""}
            </p>
            <p className="text-xs shrink-0">
              {exp.startDate || ""} To {exp.endDate || ""}
            </p>
          </div>

          {exp.workSummary ? (
            <div
              className="resume-html-content text-sm mt-1"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.workSummary) }}
            />
          ) : (
            <p className="text-sm text-gray-400 mt-1">No summary provided</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;
