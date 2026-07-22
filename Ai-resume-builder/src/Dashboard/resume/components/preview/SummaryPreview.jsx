import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";

const SummaryPreview = ({ resumeInfo, variant = "classic" }) => {
  if (!resumeInfo?.summary?.trim()) return null;

  const theme = resumeInfo?.themeColor || "#0f766e";

  return (
    <div className="mt-4">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Summary
      </h2>
      <p className="mt-1 text-sm font-normal text-slate-800">{resumeInfo.summary}</p>
    </div>
  );
};

export default SummaryPreview;
