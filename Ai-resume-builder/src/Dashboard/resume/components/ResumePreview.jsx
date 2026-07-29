import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { getTemplate } from "@/lib/resumeTemplates";
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
  const meta = getTemplate(template);

  const personal = (
    <PersonalPreviewDetail resumeInfo={resumeInfo} variant={template} />
  );
  const summary = (
    <SummaryPreview resumeInfo={resumeInfo} variant={template} />
  );
  const experience = (
    <ExperiencePreview resumeInfo={resumeInfo} variant={template} />
  );
  const projects = (
    <ProjectsPreview resumeInfo={resumeInfo} variant={template} />
  );
  const education = (
    <EducationalPreview resumeInfo={resumeInfo} variant={template} />
  );
  const skills = <SkillPreview resumeInfo={resumeInfo} variant={template} />;
  const certs = (
    <CertificationsPreview resumeInfo={resumeInfo} variant={template} />
  );
  const languages = (
    <LanguagesPreview resumeInfo={resumeInfo} variant={template} />
  );

  const fullBody = (
    <>
      {personal}
      {summary}
      {experience}
      {projects}
      {education}
      {skills}
      {certs}
      {languages}
    </>
  );

  if (meta.shell === "rail") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-modern bg-white"
        style={{ ["--resume-theme"]: themeColor }}
      >
        <div className="resume-modern-rail" aria-hidden="true" />
        <div className="resume-modern-body p-4 sm:p-8 md:p-10">{fullBody}</div>
      </div>
    );
  }

  if (meta.shell === "sidebar") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-sidebar bg-white"
        style={{ ["--resume-theme"]: themeColor }}
      >
        <aside className="resume-sidebar-col">
          {personal}
          {skills}
          {languages}
          {certs}
        </aside>
        <div className="resume-sidebar-main">
          {summary}
          {experience}
          {projects}
          {education}
        </div>
      </div>
    );
  }

  if (meta.shell === "executive") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-executive bg-white"
        style={{ ["--resume-theme"]: themeColor }}
      >
        <div
          className="resume-executive-banner"
          style={{ backgroundColor: themeColor }}
        >
          {personal}
        </div>
        <div className="resume-executive-body p-4 sm:p-8 md:p-10">
          {summary}
          {experience}
          {projects}
          {education}
          {skills}
          {certs}
          {languages}
        </div>
      </div>
    );
  }

  if (meta.shell === "plain") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-ats p-4 sm:p-8 md:p-10 bg-white border-t-0"
      >
        {fullBody}
      </div>
    );
  }

  if (meta.shell === "elegant") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-elegant p-4 sm:p-8 md:p-10 bg-white"
        style={{ ["--resume-theme"]: themeColor }}
      >
        {fullBody}
      </div>
    );
  }

  if (meta.shell === "compact") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-compact p-3 sm:p-6 md:p-7 bg-white"
        style={{ borderTop: `6px solid ${themeColor}` }}
      >
        {fullBody}
      </div>
    );
  }

  if (meta.shell === "minimal") {
    return (
      <div
        id="resume-pdf-root"
        className="resume-preview-root resume-template-minimal p-5 sm:p-9 md:p-11 bg-white"
        style={{ ["--resume-theme"]: themeColor }}
      >
        {fullBody}
      </div>
    );
  }

  // classic / bar
  return (
    <div
      id="resume-pdf-root"
      className="resume-preview-root resume-template-classic p-4 sm:p-8 md:p-10 bg-white"
      style={{ borderTop: `16px solid ${themeColor}` }}
    >
      {fullBody}
    </div>
  );
};

export default ResumePreview;
