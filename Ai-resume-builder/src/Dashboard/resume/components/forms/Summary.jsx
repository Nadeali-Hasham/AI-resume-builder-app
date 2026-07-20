import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { generateSummaryFromAI } from "./../../../../../Service/AiModal";

const Summary = ({enableNextButton, requireSaveForNext = true}) => {
    const params = useParams();
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(resumeInfo?.summary || "");
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false); // ✅ AI loading state

    // ✅ ResumeInfo update karo jab summary change ho
    useEffect(() => {
        setResumeInfo((prev) => ({ ...prev, summary: summary }));
    }, [summary, setResumeInfo]);

    const handleSummaryChange = (value) => {
        if (requireSaveForNext) {
            enableNextButton(false);
        }
        setSummary(value);
    };

    // ✅ Save function (reusable)
    const saveSummary = async (summaryText) => {
        setLoading(true);
        
        const data = {
            data: {
                summary: summaryText || summary
            }
        };

        try {
            const response = await GlobalApi.updateResumeDetail(params.resumeId, data);
            console.log("Resume updated successfully:", response.data);
            enableNextButton(true);
            toast.success("Summary updated successfully");
            return response;
        } catch (error) {
            console.error("Error updating resume:", error);
            toast.error("Failed to update summary");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ✅ AI Summary Generate Function
   const generateAISummary = async () => {
    if (!resumeInfo?.jobTitle) {
        toast.error("Please add your job title first");
        return;
    }

    setAiLoading(true);
    
    try {
        console.log("Calling AI with jobTitle:", resumeInfo.jobTitle); // ✅ Debug
        
        const aiSummary = await generateSummaryFromAI(resumeInfo.jobTitle);
        console.log("AI Summary received:", aiSummary); // ✅ Debug
        
        if (!aiSummary) {
            throw new Error("No summary generated");
        }
        
        setSummary(aiSummary);
        setResumeInfo((prev) => ({ ...prev, summary: aiSummary }));
        await saveSummary(aiSummary);
        
        toast.success("AI summary generated and saved!");
    } catch (error) {
        console.error("Error in generateAISummary:", error); // ✅ Full error
        console.error("Error message:", error.message);
        
        // ✅ Specific error messages
        if (error.message.includes("API key")) {
            toast.error("Invalid API key. Please check your .env file");
        } else if (error.message.includes("network")) {
            toast.error("Network error. Please check your internet connection");
        } else if (error.message.includes("quota")) {
            toast.error("API quota exceeded. Please try again later");
        } else {
            toast.error("Failed to generate AI summary: " + error.message);
        }
    } finally {
        setAiLoading(false);
    }
};

    const onSave = (e) => {
        e.preventDefault();
        
        if (!summary) {
            toast.error("Please add a summary");
            return;
        }

        saveSummary(summary);
    };

    return (
        <div className="app-form-panel">
            <h2 className="app-form-title">Summary</h2>
            <p className="app-form-desc">Add a brief summary of your qualifications and experience.</p>

            <form onSubmit={onSave} className="mt-4">
                <div className="flex justify-between items-end">
                    <label className="text-normal font-medium">Add Summary</label>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex gap-2 bg-white text-black cursor-pointer"
                        type="button"
                        onClick={generateAISummary} // ✅ AI function attached
                        disabled={aiLoading}
                    >
                        {aiLoading ? (
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                        ) : (
                            <Brain className="w-4 h-4" />
                        )}
                        {aiLoading ? "Generating..." : "Generate From AI"}
                    </Button>
                </div>
                <Textarea
                    placeholder="Add your summary here..."
                    className="mt-6"
                    required
                    value={summary}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                />
                <div className="flex flex-col gap-2 col-span-2 my-5">
                    <Button 
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Summary;
