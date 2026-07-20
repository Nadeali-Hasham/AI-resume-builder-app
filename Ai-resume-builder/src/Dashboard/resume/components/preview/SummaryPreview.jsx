const SummaryPreview = ({ resumeInfo }) => {
  if (!resumeInfo?.summary?.trim()) return null;

  return (
    <div className="mt-4">
      <h2
        className="font-bold text-xl text-center"
        style={{ color: resumeInfo?.themeColor }}
      >
        Summary
      </h2>
      <p className="text-sm font-normal">{resumeInfo.summary}</p>
    </div>
  );
};

export default SummaryPreview;
