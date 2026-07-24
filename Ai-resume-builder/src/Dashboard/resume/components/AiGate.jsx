import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { AI_RESUME_LIMIT, apiErrorMessage, isAiEnabledResume } from "@/lib/planLimits";
import GlobalApi from "../../../../Service/GlobalApi";
import { LoaderCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const AiConfirmContext = createContext(null);

export const AiConfirmProvider = ({ children }) => {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [aiUsed, setAiUsed] = useState(0);
  const pendingRef = useRef(null);

  const refreshSlots = useCallback(async () => {
    try {
      const res = await GlobalApi.getUserResumes();
      const list = res?.data?.data || [];
      setAiUsed(list.filter((r) => isAiEnabledResume(r)).length);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots, resumeInfo?.aiEnabled]);

  const remaining = Math.max(0, AI_RESUME_LIMIT - aiUsed);

  const resolvePending = (value) => {
    pendingRef.current?.(value);
    pendingRef.current = null;
  };

  const requestSwitchToAi = useCallback(() => {
    if (resumeInfo?.aiEnabled) {
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      pendingRef.current = resolve;
      setOpen(true);
    });
  }, [resumeInfo?.aiEnabled]);

  const enableAiNow = async () => {
    if (!resumeId) {
      toast.error("Resume id missing");
      resolvePending(false);
      setOpen(false);
      return false;
    }
    setBusy(true);
    try {
      await GlobalApi.enableResumeAi(resumeId);
      setResumeInfo((prev) => ({ ...prev, aiEnabled: true }));
      await refreshSlots();
      toast.success("AI mode on for this resume");
      resolvePending(true);
      setOpen(false);
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not enable AI"));
      resolvePending(false);
      setOpen(false);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const cancelSwitch = () => {
    resolvePending(false);
    setOpen(false);
  };

  return (
    <AiConfirmContext.Provider
      value={{
        requestSwitchToAi,
        enableAiNow,
        refreshSlots,
        aiUsed,
        remaining,
        busy,
      }}
    >
      {children}

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) cancelSwitch();
        }}
      >
        <AlertDialogContent className="border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-ink)]">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: '"Fraunces", serif' }}>
              Switch to AI mode?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-[var(--app-muted)]">
              <span className="block">
                Generate From AI needs AI mode on this resume. With AI mode you
                can only have{" "}
                <strong className="text-[var(--app-ink)]">{AI_RESUME_LIMIT} AI resumes</strong>.
                Manual resumes stay unlimited.
              </span>
              <span className="block text-amber-800 dark:text-amber-200">
                You have used {aiUsed} of {AI_RESUME_LIMIT} AI slots (
                {remaining} left).
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              disabled={busy}
              onClick={cancelSwitch}
            >
              Stay on Manual
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700"
              disabled={busy || remaining === 0}
              onClick={(e) => {
                e.preventDefault();
                enableAiNow();
              }}
            >
              {busy ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                "Switch to AI"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AiConfirmContext.Provider>
  );
};

export const useEnsureResumeAi = () => {
  const ctx = useContext(AiConfirmContext);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [enabling, setEnabling] = useState(false);

  const ensureAi = async () => {
    if (resumeInfo?.aiEnabled) return true;
    if (!ctx?.requestSwitchToAi) {
      toast.error("AI confirm unavailable");
      return false;
    }
    setEnabling(true);
    try {
      return await ctx.requestSwitchToAi();
    } finally {
      setEnabling(false);
    }
  };

  return {
    aiEnabled: Boolean(resumeInfo?.aiEnabled),
    enabling: enabling || Boolean(ctx?.busy),
    ensureAi,
  };
};

/** Top switch: Manual ↔ AI + slot warning */
export const AiModeSwitch = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();
  const ctx = useContext(AiConfirmContext);
  const [busy, setBusy] = useState(false);

  const enabled = Boolean(resumeInfo?.aiEnabled);
  const aiUsed = ctx?.aiUsed ?? 0;
  const remaining = ctx?.remaining ?? AI_RESUME_LIMIT;

  const setMode = async (wantAi) => {
    if (!resumeId || busy || ctx?.busy) return;
    if (wantAi === enabled) return;

    if (wantAi) {
      // Ask first — same dialog as Generate From AI
      await ctx?.requestSwitchToAi();
      return;
    }

    setBusy(true);
    try {
      await GlobalApi.updateResumeDetail(resumeId, {
        data: { aiEnabled: false },
      });
      setResumeInfo((prev) => ({ ...prev, aiEnabled: false }));
      await ctx?.refreshSlots?.();
      toast.success("Switched to manual");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not change mode"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-3 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-0.5">
          <button
            type="button"
            disabled={busy || ctx?.busy}
            onClick={() => setMode(false)}
            className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              !enabled
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-[var(--app-muted)] hover:bg-[var(--app-soft)]"
            }`}
          >
            Manual
          </button>
          <button
            type="button"
            disabled={busy || ctx?.busy || (!enabled && remaining === 0)}
            onClick={() => setMode(true)}
            className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              enabled
                ? "bg-teal-600 text-white"
                : "text-[var(--app-muted)] hover:bg-[var(--app-soft)]"
            } ${!enabled && remaining === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {busy || ctx?.busy ? (
              <LoaderCircle className="mx-auto h-3.5 w-3.5 animate-spin" />
            ) : (
              "AI"
            )}
          </button>
        </div>
        <p className="text-[11px] text-[var(--app-muted)]">
          AI slots: <span className="font-semibold text-[var(--app-ink)]">{aiUsed}</span>/
          {AI_RESUME_LIMIT} used ·{" "}
          <span className="font-semibold text-teal-700 dark:text-teal-300">{remaining}</span> left
        </p>
      </div>
      <p className="text-[11px] leading-relaxed text-amber-900/90 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-900/50">
        Warning: AI mode allows only {AI_RESUME_LIMIT} resumes with AI tools.
        Manual mode is unlimited. You have used {aiUsed} AI resume
        {aiUsed === 1 ? "" : "s"}; {remaining} AI slot
        {remaining === 1 ? "" : "s"} remaining.
      </p>
    </div>
  );
};
