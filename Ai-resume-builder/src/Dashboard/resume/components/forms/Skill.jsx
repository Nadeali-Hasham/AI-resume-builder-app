import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MinusIcon, PlusIcon, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../Service/GlobalApi";
import EmptySectionHint from "../EmptySectionHint";

const LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Familiar" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Expert" },
];

const emptySkill = { name: "", rating: 3 };

const Skill = ({ enableNextButton, requireSaveForNext = true }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState([{ ...emptySkill }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(resumeInfo?.skills) && resumeInfo.skills.length) {
      setSkillsList(
        resumeInfo.skills.map((s) => ({
          name: s.name || "",
          rating: Math.max(1, Math.min(5, Number(s.rating) || 3)),
        }))
      );
    } else {
      setSkillsList([{ ...emptySkill }]);
    }
  }, [resumeInfo?.skills]);

  const sync = (next) => {
    if (requireSaveForNext) enableNextButton?.(false);
    setSkillsList(next);
    setResumeInfo((prev) => ({ ...prev, skills: next }));
  };

  const handleChange = (index, field, value) => {
    sync(
      skillsList.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    );
  };

  const onSave = async (e) => {
    e.preventDefault();
    const payload = skillsList
      .map(({ name, rating }) => ({
        name: (name || "").trim(),
        rating: Math.max(1, Math.min(5, Number(rating) || 3)),
      }))
      .filter((s) => s.name);

    if (!payload.length) {
      toast.error("Add at least one skill");
      return;
    }

    setLoading(true);
    try {
      await GlobalApi.updateResumeDetail(params.resumeId, {
        data: { skills: payload },
      });
      enableNextButton?.(true);
      toast.success("Skills saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-form-panel">
      <h2 className="app-form-title">Skills</h2>
      <p className="app-form-desc">
        Add each skill and set how strong you are (Beginner → Expert).
      </p>
      {!skillsList.some((s) => s.name?.trim()) && (
        <EmptySectionHint
          title="Tip: mix core + supporting skills"
          tip="Example: React (Expert), TypeScript (Advanced), MS Office (Familiar) — ratings show depth at a glance."
        />
      )}

      <form onSubmit={onSave} className="mt-4 space-y-5">
        {skillsList.map((skill, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <Input
              placeholder="Skill name (e.g. React, MS Office)"
              value={skill.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Proficiency
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LEVELS.map((level) => {
                  const active = Number(skill.rating) === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange(index, "rating", level.value)}
                      className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                        active
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"
                      }`}
                    >
                      {level.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-1" aria-hidden="true">
                {LEVELS.map((level) => (
                  <span
                    key={level.value}
                    className={`h-1.5 flex-1 rounded-full ${
                      level.value <= Number(skill.rating || 0)
                        ? "bg-teal-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => sync([...skillsList, { ...emptySkill }])}
          >
            <PlusIcon className="h-4 w-4" /> Add skill
          </Button>
          {skillsList.length > 1 && (
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => sync(skillsList.slice(0, -1))}
            >
              <MinusIcon className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>

        <Button
          type="submit"
          className="flex w-full items-center justify-center gap-2 cursor-pointer app-btn-accent"
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Skill;
