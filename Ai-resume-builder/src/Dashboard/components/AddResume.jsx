import { Loader2, Plus, Sparkles, PenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalApi from "../../../Service/GlobalApi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AI_RESUME_LIMIT, apiErrorMessage } from "@/lib/planLimits";

const AddResume = ({ aiCount = 0, aiAtLimit = false }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [mode, setMode] = useState("ai"); // 'ai' | 'manual'
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onCreateResume = async () => {
    if (!resumeTitle.trim()) {
      toast.error("Please enter a resume title");
      return;
    }
    if (!user) {
      toast.error("Please sign in again");
      return;
    }
    if (mode === "ai" && aiAtLimit) {
      toast.error(
        `AI slots full (${AI_RESUME_LIMIT}/${AI_RESUME_LIMIT}). Create a manual resume instead.`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await GlobalApi.createNewResume({
        data: {
          title: resumeTitle.trim(),
          userName: user?.fullName,
          themeColor: "#0d9488",
          template: "classic",
          aiEnabled: mode === "ai",
        },
      });
      navigate(`/dashboard/resume/${response.data.data.documentId}/edit`);
      setOpenDialog(false);
      setResumeTitle("");
      setMode("ai");
    } catch (error) {
      console.error("Error creating resume:", error);
      toast.error(apiErrorMessage(error, "Failed to create resume"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenDialog(true)}
        className="group relative flex h-full min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-teal-300/80 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:shadow-[0_20px_40px_-24px_rgba(13,148,136,0.55)] cursor-pointer sm:min-h-[280px] sm:p-6"
        style={{ fontFamily: '"DM Sans", sans-serif' }}
      >
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-200/30 blur-2xl transition-opacity group-hover:opacity-80" />
        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
          <Plus className="h-6 w-6" strokeWidth={2.25} />
        </div>
        <p
          className="relative z-10 mt-5 text-lg font-semibold text-slate-900"
          style={{ fontFamily: '"Fraunces", serif' }}
        >
          Create New
        </p>
        <p className="relative z-10 mt-1 max-w-[12rem] text-center text-sm text-slate-500">
          Manual unlimited · AI up to {AI_RESUME_LIMIT}
        </p>
      </button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className="text-xl text-slate-900"
              style={{ fontFamily: '"Fraunces", serif' }}
            >
              Create New Resume
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Choose AI-assisted (max {AI_RESUME_LIMIT}) or write manually
              (unlimited).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("ai")}
                disabled={aiAtLimit}
                className={`rounded-xl border p-3 text-left cursor-pointer transition ${
                  mode === "ai"
                    ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                    : "border-slate-200 hover:border-slate-300"
                } ${aiAtLimit ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Sparkles className="mb-1 h-4 w-4 text-teal-700" />
                <p className="text-sm font-semibold text-slate-900">Use AI</p>
                <p className="text-[11px] text-slate-500">
                  {aiAtLimit
                    ? `Slots full (${aiCount}/${AI_RESUME_LIMIT})`
                    : `${aiCount}/${AI_RESUME_LIMIT} slots used`}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={`rounded-xl border p-3 text-left cursor-pointer transition ${
                  mode === "manual"
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <PenLine className="mb-1 h-4 w-4 text-slate-700" />
                <p className="text-sm font-semibold text-slate-900">Manual</p>
                <p className="text-[11px] text-slate-500">Unlimited resumes</p>
              </button>
            </div>

            <Input
              className="h-11"
              placeholder="Ex. Full Stack Developer"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCreateResume();
              }}
            />
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={!resumeTitle.trim() || loading || (mode === "ai" && aiAtLimit)}
                className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700"
                onClick={onCreateResume}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : mode === "ai" ? (
                  "Create with AI"
                ) : (
                  "Create manual"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddResume;
