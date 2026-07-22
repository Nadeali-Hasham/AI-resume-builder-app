import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { generateExperienceBulletsFromAI } from "./../../../../Service/AiModal";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { toast } from "sonner";

const RichTextEditor = ({ value = "", onRichTextEditorChange, index = 0 }) => {
  const [editorValue, setEditorValue] = useState(value);
  const [jobDescription, setJobDescription] = useState("");
  const [aiOptions, setAiOptions] = useState([]);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const applyHtml = (html) => {
    const clean = sanitizeHtml(html);
    setEditorValue(clean);
    onRichTextEditorChange?.(clean);
  };

  const handleChange = (e) => {
    applyHtml(e.target.value);
  };

  const generateFromAI = async () => {
    const title = resumeInfo?.experience?.[index]?.title;
    const companyName = resumeInfo?.experience?.[index]?.companyName || "";

    if (!title && !jobDescription.trim()) {
      toast.error("Add a position title or paste a job description");
      return;
    }

    setAiLoading(true);
    try {
      const result = await generateExperienceBulletsFromAI({
        title: title || "",
        companyName,
        jobDescription,
        currentHtml: editorValue,
      });
      setAiOptions(result.options || []);
      applyHtml(result.html);
      toast.success("AI bullets generated");
    } catch (error) {
      console.error("AI work summary failed:", error);
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Failed to generate work experience";
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-slate-500">
          Job description (optional)
        </label>
        <Textarea
          className="mt-1 min-h-[72px] text-sm"
          placeholder="Paste JD to tailor bullets..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-between my-2 items-center gap-2">
        <label>Work Experience</label>
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 bg-white text-black cursor-pointer"
          type="button"
          onClick={generateFromAI}
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
        <Editor value={editorValue} onChange={handleChange}>
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

      {aiOptions.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            AI options
          </p>
          {aiOptions.map((opt, i) => (
            <button
              key={i}
              type="button"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs hover:border-teal-500 cursor-pointer resume-html-content"
              onClick={() => applyHtml(opt)}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(opt) }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
