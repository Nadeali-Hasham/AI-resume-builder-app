const SkillPreview = ({ resumeInfo }) => {
  const themeColor = resumeInfo?.themeColor || "#ff6666";

  if (!resumeInfo?.skills?.length) return null;

  return (
    <div className="mt-5">
      <h2
        className="font-bold text-xl text-center"
        style={{ color: themeColor }}
      >
        Skills
      </h2>
      <div className="grid grid-cols-2 gap-x-5 mt-3">
        {resumeInfo.skills.map((skill, index) => {
          const rating = Math.max(1, Math.min(5, Number(skill.rating) || 1));
          const widthPercent = rating * 20;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 py-1"
            >
              <h2 className="text-sm font-medium shrink-0">{skill.name}</h2>
              <div
                className="skill-rating-track h-2.5 w-[120px] shrink-0 rounded-sm border border-gray-300"
                style={{
                  backgroundImage: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${widthPercent}%, #e5e7eb ${widthPercent}%, #e5e7eb 100%)`,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillPreview;
