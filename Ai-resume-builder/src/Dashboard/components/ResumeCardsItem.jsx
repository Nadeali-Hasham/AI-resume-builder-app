import { Download, Edit, Eye, MoreVertical, Share2, Trash2 } from "lucide-react";
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
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/dashboard/resume/${resumeId}/edit`}>
        <div
          className="p-14 bg-gradient-to-br from-gray-50 via-purple-100/30 to-gray-200/50 flex items-center justify-center h-[240px] border-t-4 group-hover:scale-105 transition-all duration-300"
          style={{
            borderColor: resumeData?.themeColor || "#14b8a6",
          }}
        >
          <img
            src="/cv.png"
            width={80}
            height={80}
            alt="Resume"
            className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </Link>

      <div
        className="flex items-center justify-between px-4 py-3 border-t border-gray-100"
        style={{
          backgroundColor: resumeData?.themeColor
            ? `${resumeData.themeColor}15`
            : "#f8fafc",
        }}
      >
        <h1 className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">
          {resumeTitle}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-200/70 transition-colors duration-200 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
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

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                to={`/my-resume/${resumeId}/view`}
                className="flex items-center gap-2 w-full"
              >
                <Eye className="w-4 h-4" />
                Preview
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
