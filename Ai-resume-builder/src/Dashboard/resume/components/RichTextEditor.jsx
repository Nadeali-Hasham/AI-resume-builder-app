import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import { useContext, useState } from "react";
import { BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnUnderline, Editor, EditorProvider, Separator, Toolbar } from "react-simple-wysiwyg";
import { AIChatSession } from "./../../../../Service/AiModal";
import { toast } from "sonner";

const RichTextEditor = (onRichTextEditorChange, index) => {
    const [value, setValue] = useState("");
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const [aiLoading, setAiLoading] = useState(false); // ✅ AI loading state
    const PROMPT = 'position title: {title}, Depend on position title give me 5 - 7 bullet point for my experience in resume';

    const generateSummaryFromAI = async () =>{
        setAiLoading(true)
        if (resumeInfo.experience[index].title) {
            toast('Please Add Title Position');
            return
        }
        const prompt = PROMPT.replace('{positionTitle}', resumeInfo.experience[index].title);
        const result = await AIChatSession.sendMessage(prompt);
        console.log(result.response.text());
        const resp = result.response.text();
        setValue(resp);
        setAiLoading(false);
    }

    return (
        <div>
            <div className="flex justify-between my-2">
                <label htmlFor="">Work Experience</label>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2 bg-white text-black cursor-pointer"
                    type="button"
                    onClick= {generateSummaryFromAI}
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
                    value={value} 
                    onChange={(e) => { 
                        setValue(e.target.value);
                        onRichTextEditorChange(e)} }  />
                    <Toolbar >
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <BtnLink />
                    </Toolbar>    
            </EditorProvider>
        </div>
    )
}

export default RichTextEditor
