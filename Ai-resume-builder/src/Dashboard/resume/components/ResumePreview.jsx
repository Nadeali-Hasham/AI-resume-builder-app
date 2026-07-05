import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext } from "react";
import PersonalPreviewDetail from "./preview/PersonalPreviewDetail";
import SummaryPreview from "./preview/SummaryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EductionalPreview";
import SkillPreview from "./preview/SkillPreview";

const ResumePreview = () => {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  return (
    <div style={{borderColor:resumeInfo?.themeColor}} className="shadow-lg p-14 h-full border-t-16">
      {/* Personal Detail */}
      <PersonalPreviewDetail resumeInfo={resumeInfo} />

      {/* Summary */}
      <SummaryPreview resumeInfo={resumeInfo}  />

      {/* Experience */}
      <ExperiencePreview resumeInfo={resumeInfo} />

      {/* Education  */}
      <EducationalPreview resumeInfo={resumeInfo} />

      {/* Skills */}
      <SkillPreview resumeInfo={resumeInfo} />
    </div>
  )
}

export default ResumePreview
