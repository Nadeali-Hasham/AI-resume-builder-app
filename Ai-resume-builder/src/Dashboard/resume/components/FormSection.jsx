import { Button } from "@/components/ui/button"
import PersonalDetail from "./forms/PersonalDetail"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import Summary from "./forms/Summary";
import Experiences from "./forms/Experiences";
import Eductional from "./forms/Eductional";
import Skill from "./forms/Skill";
import Projects from "./forms/Projects";
import Certifications from "./forms/Certifications";
import Languages from "./forms/Languages";
import { Link, Navigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";
import TemplatePicker from "./TemplatePicker";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Summary" },
  { id: 3, label: "Experience" },
  { id: 4, label: "Education" },
  { id: 5, label: "Skills" },
  { id: 6, label: "Projects" },
  { id: 7, label: "Certs" },
  { id: 8, label: "Languages" },
];

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNextButton, setEnableNextButton] = useState(false);
  const { resumeId } = useParams();
  const { resumeInfo } = useContext(ResumeInfoContext);

  const [requireSaveForNext] = useState(
    () => !Boolean(resumeInfo?.firstName?.trim())
  );

  useEffect(() => {
    setEnableNextButton(!requireSaveForNext);
  }, [activeFormIndex, requireSaveForNext]);

  const jumpTo = (stepId) => {
    if (!requireSaveForNext || stepId <= activeFormIndex || enableNextButton) {
      setActiveFormIndex(stepId);
    }
  };

  return (
    <div className="font-[family-name:var(--font-body)]">
      <div className="app-toolbar">
        <div className="flex gap-2 items-center flex-wrap">
          <Link to="/dashboard">
            <Button
              size="sm"
              type="button"
              className="flex gap-2 app-btn-dark cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </Button>
          </Link>
          <ThemeColor />
          <TemplatePicker />
        </div>

        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              type="button"
              className="flex gap-2 app-btn-accent cursor-pointer"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
          )}

          <Button
            size="sm"
            type="button"
            disabled={!enableNextButton}
            className="flex gap-2 app-btn-accent cursor-pointer disabled:opacity-50"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Next</span>
          </Button>
        </div>
      </div>

      <nav className="mb-4 flex flex-wrap gap-1.5" aria-label="Resume sections">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => jumpTo(step.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium cursor-pointer transition ${
              activeFormIndex === step.id
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {step.label}
          </button>
        ))}
      </nav>

      {activeFormIndex === 1 && (
        <PersonalDetail
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 2 && (
        <Summary
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 3 && (
        <Experiences
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 4 && (
        <Eductional
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 5 && (
        <Skill
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 6 && (
        <Projects
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 7 && (
        <Certifications
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 8 && (
        <Languages
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      )}
      {activeFormIndex === 9 && (
        <Navigate to={`/my-resume/${resumeInfo?.shareToken || resumeId}/view`} />
      )}
    </div>
  );
};

export default FormSection;
