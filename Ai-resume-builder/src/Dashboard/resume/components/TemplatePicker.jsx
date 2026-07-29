import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { RESUME_TEMPLATES } from "@/lib/resumeTemplates";
import { LayoutTemplate } from "lucide-react";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../Service/GlobalApi";
import { toast } from "sonner";

const TemplatePicker = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();
  const [open, setOpen] = useState(false);
  const current = resumeInfo?.template || "classic";

  const select = async (template) => {
    setResumeInfo((prev) => ({ ...prev, template }));
    setOpen(false);
    try {
      await GlobalApi.updateResumeDetail(resumeId, { data: { template } });
      toast.success(`Template: ${template}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save template");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" type="button" className="flex gap-2 app-btn-dark cursor-pointer">
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden xs:inline">Template</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 max-h-[70vh] overflow-y-auto border-[var(--app-border)] bg-[var(--app-surface)] p-3 text-[var(--app-ink)]"
        align="start"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
          Layout ({RESUME_TEMPLATES.length})
        </p>
        <div className="space-y-2">
          {RESUME_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => select(t.id)}
              className={`w-full rounded-lg border p-2.5 text-left cursor-pointer transition ${
                current === t.id
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40"
                  : "border-[var(--app-border)] hover:border-teal-400"
              }`}
            >
              <span className="block text-sm font-semibold text-[var(--app-ink)]">
                {t.label}
              </span>
              <span className="text-xs text-[var(--app-muted)]">{t.desc}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplatePicker;
