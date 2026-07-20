import { Button } from "@/components/ui/button"
import PersonalDetail from "./forms/PersonalDetail"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import Summary from "./forms/Summary";
import Experiences from "./forms/Experiences";
import Eductional from "./forms/Eductional";
import Skill from "./forms/Skill";
import { Link, Navigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNextButton, setEnableNextButton] = useState(false);
  const { resumeId } = useParams();
  const { resumeInfo } = useContext(ResumeInfoContext);

  // Capture once on mount: new resume must save each section; edit can skip
  const [requireSaveForNext] = useState(
    () => !Boolean(resumeInfo?.firstName?.trim())
  );

  useEffect(() => {
    setEnableNextButton(!requireSaveForNext);
  }, [activeFormIndex, requireSaveForNext]);

  return (
    <div className="font-[family-name:var(--font-body)]">
      <div className="app-toolbar">
        <div className="flex gap-2 items-center">
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

      {activeFormIndex === 1 ? (
        <PersonalDetail
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      ) : null}

      {activeFormIndex === 2 ? (
        <Summary
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      ) : null}

      {activeFormIndex === 3 ? (
        <Experiences
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      ) : null}

      {activeFormIndex === 4 ? (
        <Eductional
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      ) : null}

      {activeFormIndex === 5 ? (
        <Skill
          enableNextButton={(v) => setEnableNextButton(v)}
          requireSaveForNext={requireSaveForNext}
        />
      ) : null}

      {activeFormIndex === 6 ? (
        <Navigate to={`/my-resume/${resumeId}/view`} />
      ) : null}
    </div>
  );
};

export default FormSection;
