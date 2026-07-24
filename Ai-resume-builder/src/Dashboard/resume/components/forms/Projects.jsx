import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, MinusIcon, PlusIcon, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import GlobalApi from "./../../../../../Service/GlobalApi";
import EmptySectionHint from "../EmptySectionHint";

const emptyProject = {
  name: "",
  description: "",
  technologies: "",
  link: "",
  githubUrl: "",
};

const Projects = ({ enableNextButton, requireSaveForNext = true }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [list, setList] = useState([{ ...emptyProject }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo?.projects?.length) {
      setList(resumeInfo.projects);
    }
  }, [resumeInfo?.projects]);

  const sync = (next) => {
    if (requireSaveForNext) enableNextButton?.(false);
    setList(next);
    setResumeInfo((prev) => ({ ...prev, projects: next }));
  };

  const handleChange = (index, field, value) => {
    const next = list.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    sync(next);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = list
        .map(({ id, ...rest }) => ({
          name: rest.name || "",
          description: rest.description || "",
          technologies: rest.technologies || "",
          link: rest.link || "",
          githubUrl: rest.githubUrl || "",
        }))
        .filter((p) => p.name?.trim());
      await GlobalApi.updateResumeDetail(params.resumeId, {
        data: { projects: payload },
      });
      enableNextButton?.(true);
      toast.success("Projects saved");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to save projects"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-form-panel">
      <h2 className="app-form-title">Projects</h2>
      <p className="app-form-desc">Highlight work that shows impact.</p>
      {!list.some((p) => p.name?.trim()) && (
        <EmptySectionHint
          title="Tip: ship proof beats buzzwords"
          tip="Name the project, stack, and one measurable outcome. Add a live link or GitHub URL when you can."
        />
      )}
      <form onSubmit={onSave} className="mt-4 space-y-6">
        {list.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-slate-200 p-4">
            <Input
              placeholder="Project name"
              value={item.name || ""}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={item.description || ""}
              onChange={(e) => handleChange(index, "description", e.target.value)}
            />
            <Input
              placeholder="Technologies"
              value={item.technologies || ""}
              onChange={(e) => handleChange(index, "technologies", e.target.value)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Live link (optional)
                </label>
                <Input
                  placeholder="https://your-demo.com"
                  value={item.link || ""}
                  onChange={(e) => handleChange(index, "link", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  GitHub URL (optional)
                </label>
                <Input
                  placeholder="https://github.com/you/repo"
                  value={item.githubUrl || ""}
                  onChange={(e) => handleChange(index, "githubUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => sync([...list, { ...emptyProject }])}
          >
            <PlusIcon className="h-4 w-4" /> Add
          </Button>
          {list.length > 1 && (
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => sync(list.slice(0, -1))}
            >
              <MinusIcon className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>
        <Button type="submit" className="w-full cursor-pointer app-btn-accent" disabled={loading}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Projects;
