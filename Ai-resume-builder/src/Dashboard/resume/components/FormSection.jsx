import { Button } from "@/components/ui/button"
import PersonalDetail from "./forms/PersonalDetail"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import { useContext, useEffect, useMemo, useState } from "react";
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
import SaveStatusBadge from "./SaveStatusBadge";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { setSaveStatusListener } from "../../../../Service/GlobalApi";
import { AiConfirmProvider, AiModeSwitch } from "./AiGate";

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

const computeFilledSteps = (info) => {
  if (!info) return 0;
  let n = 0;
  if (info.firstName?.trim() && info.lastName?.trim()) n += 1;
  if (info.summary?.trim()) n += 1;
  if (info.experience?.length) n += 1;
  if (info.education?.length) n += 1;
  if (info.skills?.length) n += 1;
  if (info.projects?.length) n += 1;
  if (info.certifications?.length) n += 1;
  if (info.languages?.length) n += 1;
  return n;
};

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNextButton, setEnableNextButton] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const { resumeId } = useParams();
  const { resumeInfo } = useContext(ResumeInfoContext);

  const [requireSaveForNext] = useState(
    () => !Boolean(resumeInfo?.firstName?.trim())
  );

  const filled = useMemo(() => computeFilledSteps(resumeInfo), [resumeInfo]);
  const progressPct = Math.round((filled / STEPS.length) * 100);

  useEffect(() => {
    setEnableNextButton(!requireSaveForNext);
  }, [activeFormIndex, requireSaveForNext]);

  useEffect(() => {
    setSaveStatusListener((status) => {
      setSaveStatus(status);
      if (status === "saved") {
        window.clearTimeout(window.__resumeSaveToastTimer);
        window.__resumeSaveToastTimer = window.setTimeout(() => {
          setSaveStatus("idle");
        }, 2200);
      }
    });
    return () => setSaveStatusListener(null);
  }, []);

  const jumpTo = (stepId) => {
    if (!requireSaveForNext || stepId <= activeFormIndex || enableNextButton) {
      setActiveFormIndex(stepId);
    }
  };

  return (
    <AiConfirmProvider>
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
          <SaveStatusBadge status={saveStatus} />
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              type="button"
              className="flex flex-1 gap-2 app-btn-accent cursor-pointer sm:flex-none"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sm:hidden">Prev</span>
              <span className="hidden sm:inline">Previous</span>
            </Button>
          )}

          <Button
            size="sm"
            type="button"
            disabled={!enableNextButton}
            className="flex flex-1 gap-2 app-btn-accent cursor-pointer disabled:opacity-50 sm:flex-none"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Next</span>
          </Button>
        </div>
      </div>

      <AiModeSwitch />

      <div className="mb-4 rounded-xl border border-slate-200 bg-white/90 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Progress
          </p>
          <p className="text-xs font-medium text-teal-800">
            {filled}/{STEPS.length} sections · {progressPct}%
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="Resume sections">
          {STEPS.map((step) => {
            const isActive = activeFormIndex === step.id;
            const isDone =
              (step.id === 1 && resumeInfo?.firstName?.trim()) ||
              (step.id === 2 && resumeInfo?.summary?.trim()) ||
              (step.id === 3 && resumeInfo?.experience?.length) ||
              (step.id === 4 && resumeInfo?.education?.length) ||
              (step.id === 5 && resumeInfo?.skills?.length) ||
              (step.id === 6 && resumeInfo?.projects?.length) ||
              (step.id === 7 && resumeInfo?.certifications?.length) ||
              (step.id === 8 && resumeInfo?.languages?.length);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => jumpTo(step.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium cursor-pointer transition ${
                  isActive
                    ? "bg-teal-700 text-white shadow-sm"
                    : isDone
                      ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                        ? "bg-teal-600 text-white"
                        : "bg-white text-slate-500"
                  }`}
                >
                  {step.id}
                </span>
                {step.label}
              </button>
            );
          })}
        </nav>
      </div>

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
      {activeFormIndex === 9 && resumeInfo?.shareToken && (
        <Navigate to={`/my-resume/${resumeInfo.shareToken}/view`} />
      )}
      {activeFormIndex === 9 && !resumeInfo?.shareToken && (
        <div className="app-form-panel">
          <p className="app-subtitle text-sm">
            Preparing your share link… open View from the dashboard if this stays.
          </p>
        </div>
      )}
    </div>
    </AiConfirmProvider>
  );
};

export default FormSection;
