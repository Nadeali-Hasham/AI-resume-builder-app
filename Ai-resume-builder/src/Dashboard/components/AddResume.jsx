import { Loader2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalApi from "../../../Service/GlobalApi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddResume = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
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

        setLoading(true);

        const data = {
            data: {
                title: resumeTitle.trim(),
                userName: user?.fullName,
                themeColor: "#0d9488",
                template: "classic",
            }
        };

        try {
            const response = await GlobalApi.createNewResume(data);
            setLoading(false);
            navigate(`/dashboard/resume/${response.data.data.documentId}/edit`);
            setOpenDialog(false);
            setResumeTitle("");
        } catch (error) {
            console.error("Error creating resume:", error);
            setLoading(false);
            const msg =
                error?.response?.data?.error?.message ||
                error?.response?.data?.message ||
                "Failed to create resume";
            toast.error(msg);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpenDialog(true)}
                className="group relative flex h-full min-h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-teal-300/80 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:shadow-[0_20px_40px_-24px_rgba(13,148,136,0.55)] cursor-pointer"
                style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-200/30 blur-2xl transition-opacity group-hover:opacity-80" />
                <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-slate-300/20 blur-2xl" />

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <Plus className="h-6 w-6" strokeWidth={2.25} />
                </div>
                <p
                    className="relative z-10 mt-5 text-lg font-semibold text-slate-900"
                    style={{ fontFamily: '"Fraunces", serif' }}
                >
                    Create New
                </p>
                <p className="relative z-10 mt-1 max-w-[11rem] text-center text-sm text-slate-500">
                    Start a fresh resume with AI assistance
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
                            Give your resume a clear role-focused title.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-2 space-y-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
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
                                disabled={!resumeTitle.trim() || loading}
                                className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700"
                                onClick={onCreateResume}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    "Create Resume"
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
