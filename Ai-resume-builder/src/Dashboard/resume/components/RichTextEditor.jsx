import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnUnderline, Editor, EditorProvider, Separator, Toolbar } from "react-simple-wysiwyg";
import { AIChatSession } from "./../../../../Service/AiModal";
import { toast } from "sonner";

const RichTextEditor = ({ value = "", onRichTextEditorChange, index = 0 }) => {
    const [editorValue, setEditorValue] = useState(value);
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [aiLoading, setAiLoading] = useState(false);
    const PROMPT = "position title: {title}, Depend on position title give me 5 - 7 bullet point for my experience in resume";

    useEffect(() => {
        setEditorValue(value || "");
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setEditorValue(newValue);
        onRichTextEditorChange?.(newValue);
    };

    const generateSummaryFromAI = async () => {
        const title = resumeInfo?.experience?.[index]?.title;

        if (!title) {
            toast.error("Please Add Title Position");
            return;
        }

        setAiLoading(true);
        try {
            const prompt = PROMPT.replace("{title}", title);
            const result = await AIChatSession.sendMessage(prompt);
            const resp = result.response.text();
            setEditorValue(resp);
            onRichTextEditorChange?.(resp);
        } catch (error) {
            console.error("AI work summary failed:", error);
            toast.error("Failed to generate work experience");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between my-2">
                <label htmlFor="">Work Experience</label>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2 bg-white text-black cursor-pointer"
                    type="button"
                    onClick={generateSummaryFromAI}
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
            <EditorProvider>
                <Editor
                    value={editorValue}
                    onChange={handleChange}
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
};

export default RichTextEditor;
