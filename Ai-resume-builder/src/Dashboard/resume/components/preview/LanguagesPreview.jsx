import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";

const LanguagesPreview = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";
  const items = resumeInfo?.languages || [];
  if (!items.length) return null;

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Languages
      </h2>
      <p className="mt-2 text-sm">
        {items
          .map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name))
          .filter(Boolean)
          .join(" · ")}
      </p>
    </div>
  );
};

export default LanguagesPreview;
