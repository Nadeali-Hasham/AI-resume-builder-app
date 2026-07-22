import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext } from "react";
import PersonalPreviewDetail from "./preview/PersonalPreviewDetail";
import SummaryPreview from "./preview/SummaryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EductionalPreview";
import SkillPreview from "./preview/SkillPreview";
import ProjectsPreview from "./preview/ProjectsPreview";
import CertificationsPreview from "./preview/CertificationsPreview";
import LanguagesPreview from "./preview/LanguagesPreview";
import "./resume-templates.css";

const ResumePreview = () => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const themeColor = resumeInfo?.themeColor || "#0f766e";
  const template = resumeInfo?.template || "classic";

  const body = (
    <>
      <PersonalPreviewDetail resumeInfo={resumeInfo} variant={template} />
      <SummaryPreview resumeInfo={resumeInfo} variant={template} />
      <ExperiencePreview resumeInfo={resumeInfo} variant={template} />
      <ProjectsPreview resumeInfo={resumeInfo} variant={template} />
      <EducationalPreview resumeInfo={resumeInfo} variant={template} />
      <SkillPreview resumeInfo={resumeInfo} variant={template} />
      <CertificationsPreview resumeInfo={resumeInfo} variant={template} />
      <LanguagesPreview resumeInfo={resumeInfo} variant={template} />
    </>
  );

  if (template === "modern") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-modern bg-white"
        style={{ ["--resume-theme"]: themeColor }}
      >
        <div className="resume-modern-rail" aria-hidden="true" />
        <div className="resume-modern-body p-4 sm:p-8 md:p-10">{body}</div>
      </div>
    );
  }

  if (template === "ats") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-ats p-4 sm:p-8 md:p-10 bg-white border-t-0"
      >
        {body}
      </div>
    );
  }

  return (
    <div
      id="resume-pdf-root"
      className="resume-preview-root resume-template-classic p-4 sm:p-8 md:p-10 bg-white"
      style={{ borderTop: `16px solid ${themeColor}` }}
    >
      {body}
    </div>
  );
};

export default ResumePreview;
