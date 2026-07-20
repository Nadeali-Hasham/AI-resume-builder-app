const EducationalPreview = ({ resumeInfo }) => {
  if (!resumeInfo?.education?.length) return null;

  return (
    <div className="mt-5">
      <h2
        className="font-bold text-xl text-center"
        style={{ color: resumeInfo?.themeColor }}
      >
        Education
      </h2>
      {resumeInfo.education.map((edu, index) => (
        <div key={index} className="py-2">
          <h3
            style={{ color: resumeInfo?.themeColor }}
            className="font-semibold"
          >
            {edu.degree} in {edu.major}
          </h3>
          <div className="flex justify-between">
            <p>{edu.universityName}</p>
            <p className="text-xs">
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
