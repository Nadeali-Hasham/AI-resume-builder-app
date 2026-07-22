import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { generateSummaryFromAI } from "./../../../../../Service/AiModal";
import EmptySectionHint from "../EmptySectionHint";
import { AI_DAILY_LIMIT, AI_JD_MAX_CHARS, apiErrorMessage } from "@/lib/planLimits";

const Summary = ({ enableNextButton, requireSaveForNext = true }) => {
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(resumeInfo?.summary || "");
    const [jobDescription, setJobDescription] = useState("");
    const [aiOptions, setAiOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        setResumeInfo((prev) => ({ ...prev, summary }));
    }, [summary, setResumeInfo]);

    const handleSummaryChange = (value) => {
        if (requireSaveForNext) enableNextButton(false);
        setSummary(value);
    };

    const saveSummary = async (summaryText) => {
        setLoading(true);
        try {
            await GlobalApi.updateResumeDetail(params.resumeId, {
                data: { summary: summaryText || summary },
            });
            enableNextButton(true);
            toast.success("Summary updated successfully");
        } catch (error) {
            console.error("Error updating resume:", error);
            toast.error("Failed to update summary");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const generateAISummary = async () => {
        if (!resumeInfo?.jobTitle && !jobDescription.trim()) {
            toast.error("Add a job title or paste a job description");
            return;
        }

        setAiLoading(true);
        try {
            const result = await generateSummaryFromAI({
                jobTitle: resumeInfo?.jobTitle || "",
                jobDescription: jobDescription.slice(0, AI_JD_MAX_CHARS),
                currentSummary: summary,
            });
            setAiOptions(result.options || []);
            const pick = result.summary || result.options?.[0];
            if (!pick) throw new Error("No summary generated");
            setSummary(pick);
            setResumeInfo((prev) => ({ ...prev, summary: pick }));
            await saveSummary(pick);
            toast.success("AI summary ready — pick another option below if you like");
        } catch (error) {
            console.error("Error in generateAISummary:", error);
            toast.error(apiErrorMessage(error, "Failed to generate AI summary"));
        } finally {
            setAiLoading(false);
        }
    };

    const onSave = (e) => {
        e.preventDefault();
        if (!summary.trim()) {
            toast.error("Please add a summary");
            return;
        }
        saveSummary(summary);
    };

    return (
        <div className="app-form-panel">
            <h2 className="app-form-title">Summary</h2>
            <p className="app-form-desc">
                Write a short pitch — or tailor it to a job description with AI
                (about {AI_DAILY_LIMIT} AI uses / day on the free plan).
            </p>
            {!summary?.trim() && (
                <EmptySectionHint
                    title="Tip: strong summaries sell you in 3 lines"
                    tip='Example: "MERN developer with 2+ years building production apps — React, Node, and MongoDB. Led features that cut load time 30%."'
                />
            )}

            <form onSubmit={onSave} className="mt-4 space-y-4">
                <div>
                    <label className="text-sm font-medium">Job description (optional)</label>
                    <Textarea
                        placeholder="Paste a JD to tailor the summary..."
                        className="mt-2 min-h-[90px]"
                        value={jobDescription}
                        maxLength={AI_JD_MAX_CHARS}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                        {jobDescription.length}/{AI_JD_MAX_CHARS}
                    </p>
                </div>

                <div className="flex justify-between items-end gap-2">
                    <label className="text-sm font-medium">Your summary</label>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex gap-2 bg-white text-black cursor-pointer"
                        type="button"
                        onClick={generateAISummary}
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
                    className="min-h-[120px]"
                    required
                    value={summary}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                />

                {aiOptions.length > 1 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            AI options
                        </p>
                        {aiOptions.map((opt, i) => (
                            <button
                                key={i}
                                type="button"
                                className="app-ai-option"
                                onClick={() => {
                                    handleSummaryChange(opt);
                                    if (requireSaveForNext) enableNextButton(false);
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                <Button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl disabled:opacity-60 cursor-pointer"
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
            </form>
        </div>
    );
};

export default Summary;
