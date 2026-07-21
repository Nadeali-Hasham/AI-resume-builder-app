import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import GlobalApi from "./../../../../Service/GlobalApi";

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#33FFA1",
  "#FF7133",
  "#71FF33",
  "#FF3371",
  "#33FF71",
  "#3371FF",
  "#A1FF33",
  "#33A1FF",
  "#5733FF",
  "#33FF5A",
  "#5A33FF",
  "#FF335A",
  "#335AFF",
  "#14b8a6",
  "#0f172a",
];

const COLOR_PREVIEW_MS = 300;
const TOAST_DEBOUNCE_MS = 1000;

const ThemeColor = () => {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const colorInputRef = useRef(null);
  const latestColorRef = useRef(resumeInfo?.themeColor || "#ff6666");
  const previewTimerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const lastPreviewAtRef = useRef(0);

  const pendingSaveColorRef = useRef(null);

  useEffect(() => {
    latestColorRef.current = resumeInfo?.themeColor || "#ff6666";
  }, [resumeInfo?.themeColor]);

  useEffect(() => {
    return () => {
      clearTimeout(previewTimerRef.current);
      clearTimeout(debounceTimerRef.current);
      // Flush pending theme save on unmount so color isn't lost
      const pending = pendingSaveColorRef.current;
      if (pending && resumeId) {
        GlobalApi.updateResumeDetail(resumeId, {
          data: { themeColor: pending },
        }).catch((error) => {
          console.error("Failed to flush theme color:", error);
        });
      }
    };
  }, [resumeId]);

  const saveThemeColor = async (color) => {
    pendingSaveColorRef.current = null;
    if (!resumeId) {
      toast.success("Theme color updated");
      return;
    }

    setSaving(true);
    try {
      await GlobalApi.updateResumeDetail(resumeId, {
        data: { themeColor: color },
      });
      toast.success("Theme color updated");
    } catch (error) {
      console.error("Failed to save theme color:", error);
      toast.error("Color applied, but failed to save");
    } finally {
      setSaving(false);
    }
  };

  const scheduleSaveAndToast = (color) => {
    pendingSaveColorRef.current = color;
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      saveThemeColor(color);
    }, TOAST_DEBOUNCE_MS);
  };

  const applyPreviewColor = (color) => {
    latestColorRef.current = color;
    setResumeInfo((prev) => ({
      ...prev,
      themeColor: color,
    }));
  };

  // Live preview every 300ms while dragging
  const handleLiveColorInput = (rawColor) => {
    const color = rawColor?.toLowerCase?.() || rawColor;
    latestColorRef.current = color;

    const now = Date.now();
    const elapsed = now - lastPreviewAtRef.current;

    if (elapsed >= COLOR_PREVIEW_MS) {
      lastPreviewAtRef.current = now;
      applyPreviewColor(color);
    } else {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = setTimeout(() => {
        lastPreviewAtRef.current = Date.now();
        applyPreviewColor(latestColorRef.current);
      }, COLOR_PREVIEW_MS - elapsed);
    }

    // Toast/save only after user pauses for 3 seconds
    scheduleSaveAndToast(color);
  };

  // Instant apply for preset swatches, then debounce toast/save
  const handlePresetColor = (rawColor) => {
    const color = rawColor?.toLowerCase?.() || rawColor;
    applyPreviewColor(color);
    setOpen(false);
    scheduleSaveAndToast(color);
  };

  const openMoreColors = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);

    setTimeout(() => {
      colorInputRef.current?.click();
    }, 150);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="flex gap-2 bg-white text-black border border-gray-300 hover:bg-gray-50 hover:text-black cursor-pointer"
            disabled={saving}
          >
            <LayoutGrid className="w-4 h-4 text-black" />
            <span className="text-black">Theme</span>
            {resumeInfo?.themeColor && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-400"
                style={{ backgroundColor: resumeInfo.themeColor }}
              />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-64 bg-white p-4"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Select Theme Color
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {colors.map((color) => {
              const selected =
                resumeInfo?.themeColor?.toLowerCase() === color.toLowerCase();

              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  className={`h-8 w-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                    selected
                      ? "border-gray-900 scale-110 ring-2 ring-offset-2 ring-gray-400"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetColor(color)}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={openMoreColors}
            onPointerDown={(e) => e.stopPropagation()}
            className="mt-4 w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
          >
            More Color
          </button>
        </PopoverContent>
      </Popover>

      <input
        ref={colorInputRef}
        type="color"
        value={resumeInfo?.themeColor || "#ff6666"}
        onInput={(e) => handleLiveColorInput(e.target.value)}
        onChange={(e) => handleLiveColorInput(e.target.value)}
        className="fixed opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
        aria-label="Pick more theme color"
      />
    </>
  );
};

export default ThemeColor;
