'use client'
import { Loader2, PlusSquare } from "lucide-react"
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
import { v4 as uuidv4 } from 'uuid'
import GlobalApi from "../../../Service/GlobalApi";
import { useUser } from "@clerk/clerk-react";

const AddResume = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const onCreateResume = async () => {
        if (!resumeTitle) {
            alert("Please enter a resume title");
            return;
        }

        setLoading(true);
        const uuid = uuidv4();
        const data = {
            data: {
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            }
        };

        try {
            const response = await GlobalApi.createNewResume(data);
            console.log("Resume created:", response.data);
            setLoading(false);
            setOpenDialog(false);
            setResumeTitle(""); // Reset form
            // Optional: Refresh resumes list
            // window.location.reload();
        } catch (error) {
            console.error("Error creating resume:", error);
            setLoading(false);
            alert("Failed to create resume. Check console for details.");
        }
    };

    return (
        <>
            <div 
                className="border border-dashed rounded-xl h-72 border-gray-300 p-14 py-24 bg-secondary bg-pink-100 flex items-center justify-center hover:scale-105 transition-transform hover:shadow-lg cursor-pointer"
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare className="h-8 w-8" />
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add the title for your new resume.</p>
                            <Input 
                                className="mt-2" 
                                placeholder="Ex. Full stack developer"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)} 
                            />
                        </DialogDescription>
                        <div className="flex items-center justify-end mt-4 gap-5">
                            <Button 
                                variant="outline"
                                className="cursor-pointer border hover:bg-gray-100" 
                                onClick={() => setOpenDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                disabled={!resumeTitle || loading} 
                                className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600" 
                                onClick={onCreateResume}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    "Confirm"
                                )}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddResume;