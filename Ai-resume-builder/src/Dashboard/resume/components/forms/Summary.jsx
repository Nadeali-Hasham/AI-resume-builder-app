import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import GlobalApi from "./../../../../../Service/GlobalApi";

const Summary = ({enableNextButton}) => {
    const params = useParams();
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(resumeInfo?.summary || "");
    const [loading, setLoading] = useState(false);

    // ✅ ResumeInfo update karo jab summary change ho
    useEffect(() => {
        setResumeInfo((prev) => ({ ...prev, summary: summary }));
    }, [summary]);

    const onSave = (e) => {
        e.preventDefault();
        
        if (!summary) {
            toast.error("Please add a summary");
            return;
        }

        setLoading(true);
        
        // ✅ Sahi data format (Strapi ke liye)
        const data = {
            data: {
                summary: summary
            }
        };

        GlobalApi.updateResumeDetail(params.resumeId, data)
            .then((response) => {
                console.log("Resume updated successfully:", response.data);
                enableNextButton(true);
                setLoading(false);
                toast.success("Summary updated successfully");
            })
            .catch((error) => {
                console.error("Error updating resume:", error);
                setLoading(false);
                toast.error("Failed to update summary");
            });
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-teal-500">
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            <p>Add a brief summary of your qualifications and experience.</p>

            <form onSubmit={onSave} className="mt-4">
                <div className="flex justify-between items-end">
                    <label className="text-normal font-medium">Add Summary</label>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex gap-2 bg-white text-black cursor-pointer"
                        type="button"
                    >
                        <Brain className="w-4 h-4" />
                        Generate From AI
                    </Button>
                </div>
                <Textarea
                    placeholder="Add your summary here..."
                    className="mt-6"
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />
                <div className="flex flex-col gap-2 col-span-2">
                    <Button 
                        type="submit"
                        className="mt-4 text-white bg-teal-500 cursor-pointer hover:bg-teal-600"
                        disabled={loading}
                    >
                        {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Summary;