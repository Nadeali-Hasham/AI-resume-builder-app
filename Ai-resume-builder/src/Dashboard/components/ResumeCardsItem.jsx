import {
  Copy,
  Download,
  Edit,
  FileText as FileTextIcon,
  MoreVertical,
  Pencil,
  Share2,
  Trash2,
  CopyPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import { useState } from "react";
import GlobalApi from "../../../Service/GlobalApi";

const ResumeCardsItem = ({ resume, refreshData }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const resumeData = resume?.attributes || resume;
  const resumeId = resume.documentId || resumeData.documentId || resume.id;
  const resumeTitle = resumeData?.title || "Untitled Resume";
  const themeColor = resumeData?.themeColor || "#0d9488";
  const jobTitle = resumeData?.jobTitle;
  const shareToken = resumeData?.shareToken;
  const personName = [resumeData?.firstName, resumeData?.lastName].filter(Boolean).join(" ");
  const templateLabel = (resumeData?.template || "classic").toUpperCase();
  const isAi = Boolean(resumeData?.aiEnabled);
  const updatedLabel = resumeData?.updatedAt
    ? new Date(resumeData.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const shareUrl = shareToken
    ? `${(import.meta.env.VITE_BASE_URL || window.location.origin).replace(/\/$/, "")}/my-resume/${shareToken}/view`
    : "";

  const ensureShareToken = async () => {
    if (shareToken) return shareToken;
    const res = await GlobalApi.rotateShareToken(resumeId);
    const token = res?.data?.data?.shareToken;
    if (!token) throw new Error("No share token");
    refreshData?.();
    return token;
  };

  const handleDownload = async () => {
    try {
      const token = await ensureShareToken();
      navigate(`/my-resume/${token}/view?download=true`);
    } catch {
      toast.error("Could not prepare share link");
    }
  };

  const handleDelete = async () => {
    if (!resumeId) {
      toast.error("Resume id not found");
      return;
    }
    setDeleting(true);
    const toastId = toast.loading("Deleting resume...");
    try {
      await GlobalApi.deleteResume(resumeId);
      toast.dismiss(toastId);
      toast.success("Resume deleted successfully");
      refreshData?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast.dismiss(toastId);
      toast.error("Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setBusy(true);
    try {
      await GlobalApi.duplicateResume(resumeId);
      toast.success("Resume duplicated");
      refreshData?.();
    } catch (error) {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Failed to duplicate";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleRename = async () => {
    const title = newTitle.trim();
    if (!title) {
      toast.error("Enter a title");
      return;
    }
    setBusy(true);
    try {
      await GlobalApi.updateResumeDetail(resumeId, { data: { title } });
      toast.success("Renamed");
      setRenameOpen(false);
      refreshData?.();
    } catch {
      toast.error("Failed to rename");
    } finally {
      setBusy(false);
    }
  };

  const copyShareLink = async () => {
    try {
      const token = await ensureShareToken();
      const url = `${(import.meta.env.VITE_BASE_URL || window.location.origin).replace(/\/$/, "")}/my-resume/${token}/view`;
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const rotateShare = async () => {
    setBusy(true);
    try {
      await GlobalApi.rotateShareToken(resumeId);
      toast.success("New share link generated — old link stopped working");
      refreshData?.();
    } catch {
      toast.error("Failed to rotate share link");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_rgba(15,23,42,0.4)] sm:min-h-[280px]"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: themeColor }} />

      <Link
        to={`/dashboard/resume/${resumeId}/edit`}
        className="relative flex flex-1 flex-col px-4 pt-5 pb-3"
      >
        <div className="relative mx-auto w-full max-w-[160px] flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-inner transition-transform duration-300 group-hover:scale-[1.02]">
          <div
            className="absolute left-0 top-0 h-full w-1.5"
            style={{ backgroundColor: themeColor }}
          />
          <p
            className="truncate text-[11px] font-bold leading-tight"
            style={{ color: themeColor, fontFamily: '"Fraunces", serif' }}
          >
            {personName || resumeTitle}
          </p>
          <p className="mt-0.5 truncate text-[9px] text-slate-500">
            {jobTitle || "Role title"}
          </p>
          <div className="mt-2 space-y-1">
            <div className="h-1 rounded-full bg-slate-100" />
            <div className="h-1 w-5/6 rounded-full bg-slate-100" />
            <div className="h-1 w-4/6 rounded-full bg-slate-100" />
          </div>
          <div className="mt-2 flex gap-1">
            <span
              className="rounded px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: themeColor }}
            >
              {templateLabel}
            </span>
            <span
              className={`rounded px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${
                isAi ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              {isAi ? "AI" : "Manual"}
            </span>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-2 bg-gradient-to-t from-white via-white/95 to-transparent px-2 pb-2 pt-8 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white">
              Edit
            </span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700">
              Open
            </span>
          </div>
        </div>

        <div className="mt-4 min-w-0">
          <h3
            className="truncate text-[15px] font-semibold text-slate-900"
            style={{ fontFamily: '"Fraunces", serif' }}
            title={resumeTitle}
          >
            {resumeTitle}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {jobTitle || "Open to edit details"}
          </p>
          {updatedLabel && (
            <p className="mt-1 text-[11px] text-slate-400">Updated {updatedLabel}</p>
          )}
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-2 py-2">
        <div className="flex items-center gap-0.5">
          <Link
            to={`/dashboard/resume/${resumeId}/edit`}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-teal-700"
            title="Edit"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="h-3.5 w-3.5" />
          </Link>
          <Link
            to={`/my-resume/${shareToken}/view`}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-teal-700"
            title="Preview"
            onClick={(e) => e.stopPropagation()}
          >
            <FileTextIcon className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-teal-700 cursor-pointer"
            title="Download PDF"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-800 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 bg-white">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                to={`/dashboard/resume/${resumeId}/edit`}
                className="flex items-center gap-2 w-full"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                setNewTitle(resumeTitle);
                setRenameOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={handleDuplicate}
              disabled={busy}
            >
              <CopyPlus className="w-4 h-4" />
              Duplicate
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={copyShareLink}
            >
              <Copy className="w-4 h-4" />
              Copy share link
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={rotateShare}
              disabled={busy}
            >
              <Share2 className="w-4 h-4" />
              Rotate share link
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer p-0 focus:bg-transparent"
              onSelect={(e) => e.preventDefault()}
            >
              <RWebShare
                data={{
                  text: "Hello everyone, please take a look at my professional resume.",
                  url: shareUrl,
                  title: `${resumeTitle} resume`,
                }}
                sites={[
                  "facebook",
                  "twitter",
                  "whatsapp",
                  "reddit",
                  "telegram",
                  "linkedin",
                  "mail",
                  "copy",
                ]}
                disableNative={true}
                closeText="Close"
                onClick={() => toast.success("Shared successfully")}
              >
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Share Resume
                </button>
              </RWebShare>
            </DropdownMenuItem>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes &quot;{resumeTitle}&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer" disabled={deleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 cursor-pointer"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          />
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button className="cursor-pointer app-btn-accent" onClick={handleRename} disabled={busy}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeCardsItem;
