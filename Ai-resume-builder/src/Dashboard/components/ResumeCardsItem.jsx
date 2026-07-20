import { Download, Edit, MoreVertical, Share2, Trash2 } from "lucide-react";
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
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import { useState } from "react";
import GlobalApi from "../../../Service/GlobalApi";

const ResumeCardsItem = ({ resume, refreshData }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const resumeData = resume?.attributes || resume;
  const resumeId = resume.documentId || resumeData.documentId || resume.id;
  const resumeTitle = resumeData?.title || "Untitled Resume";
  const themeColor = resumeData?.themeColor || "#0d9488";
  const jobTitle = resumeData?.jobTitle;
  const updatedLabel = resumeData?.updatedAt
    ? new Date(resumeData.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const shareUrl =
    `${(import.meta.env.VITE_BASE_URL || window.location.origin).replace(/\/$/, "")}/my-resume/${resumeId}/view`;

  const handleDownload = () => {
    navigate(`/my-resume/${resumeId}/view?download=true`);
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

  return (
    <div
      className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_rgba(15,23,42,0.4)]"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: themeColor }} />

      <Link
        to={`/dashboard/resume/${resumeId}/edit`}
        className="relative flex flex-1 flex-col px-4 pt-5 pb-3"
      >
        <div
          className="relative mx-auto w-full max-w-[150px] flex-1 rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 shadow-inner transition-transform duration-300 group-hover:scale-[1.02]"
        >
          <div
            className="mb-2 h-2 w-2/3 rounded-full"
            style={{ backgroundColor: themeColor, width: "65%" }}
          />
          <div className="mb-3 h-1.5 w-1/2 rounded-full bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-1 rounded-full bg-slate-100" />
            <div className="h-1 w-5/6 rounded-full bg-slate-100" />
            <div className="h-1 w-4/6 rounded-full bg-slate-100" />
          </div>
          <div className="mt-3 space-y-1.5">
            <div
              className="h-1.5 w-1/3 rounded-full"
              style={{ backgroundColor: `${themeColor}99` }}
            />
            <div className="h-1 rounded-full bg-slate-100" />
            <div className="h-1 w-4/5 rounded-full bg-slate-100" />
          </div>
          <div
            className="absolute -right-1 bottom-2 h-8 w-1.5 rounded-full opacity-80"
            style={{ backgroundColor: themeColor }}
          />
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

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-3 py-2.5">
        <Link
          to={`/my-resume/${resumeId}/view`}
          className="text-xs font-medium text-teal-700 hover:text-teal-800 cursor-pointer"
        >
          Preview
        </Link>

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

          <DropdownMenuContent align="end" className="w-48 bg-white">
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
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download PDF
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
                  <AlertDialogTitle className="text-xl font-bold">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500">
                    This action cannot be undone. This will permanently delete
                    your resume "
                    <span className="font-medium text-gray-700">
                      {resumeTitle}
                    </span>
                    " from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-3 mt-4">
                  <AlertDialogCancel
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    disabled={deleting}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
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
    </div>
  );
};

export default ResumeCardsItem;
