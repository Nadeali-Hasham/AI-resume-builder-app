import {
  sectionHeadingClass,
  sectionHeadingStyle,
  subHeadingStyle,
} from "./sectionHeading";

const EducationalPreview = ({ resumeInfo, variant = "classic" }) => {
  if (!resumeInfo?.education?.length) return null;

  const theme = resumeInfo?.themeColor || "#0f766e";

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Education
      </h2>
      {resumeInfo.education.map((edu, index) => (
        <div key={index} className="py-2">
          <h3 className="font-semibold" style={subHeadingStyle(variant, theme)}>
            {edu.degree} in {edu.major}
          </h3>
          <div className="flex justify-between gap-2">
            <p>{edu.universityName}</p>
            <p className="text-xs shrink-0">
              {edu.startDate} - {edu.endDate}
            </p>
          </div>
          <p className="text-sm">{edu.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EducationalPreview;
