import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ImagePlus, LoaderCircle, MinusIcon, PlusIcon, Save, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import GlobalApi from "./../../../../../Service/GlobalApi";

const emptyCert = {
  name: "",
  issuer: "",
  date: "",
  credentialUrl: "",
  imageUrl: "",
};

const Certifications = ({ enableNextButton, requireSaveForNext = true }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [list, setList] = useState([{ ...emptyCert }]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    if (resumeInfo?.certifications?.length) setList(resumeInfo.certifications);
  }, [resumeInfo?.certifications]);

  const sync = (next) => {
    if (requireSaveForNext) enableNextButton?.(false);
    setList(next);
    setResumeInfo((prev) => ({ ...prev, certifications: next }));
  };

  const handleChange = (index, field, value) => {
    sync(list.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const onUploadImage = async (index, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Only image or PDF allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }

    setUploadingIndex(index);
    try {
      const res = await GlobalApi.uploadFile(file);
      const url = res?.data?.data?.url;
      if (!url) throw new Error("No URL returned");
      handleChange(index, "imageUrl", url);
      toast.success("Certificate file uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = list
        .map(({ id, ...rest }) => ({
          name: (rest.name || "").trim(),
          issuer: (rest.issuer || "").trim(),
          date: (rest.date || "").trim(),
          credentialUrl: (rest.credentialUrl || "").trim(),
          imageUrl: rest.imageUrl || "",
        }))
        .filter((c) => c.name);
      await GlobalApi.updateResumeDetail(params.resumeId, {
        data: { certifications: payload },
      });
      enableNextButton?.(true);
      toast.success("Certifications saved");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to save certifications"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-form-panel">
      <h2 className="app-form-title">Certifications</h2>
      <p className="app-form-desc">
        Credentials that strengthen your profile. Image upload is optional.
      </p>
      <form onSubmit={onSave} className="mt-4 space-y-6">
        {list.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2"
          >
            <Input
              placeholder="Certificate name"
              value={item.name || ""}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <Input
              placeholder="Issuer"
              value={item.issuer || ""}
              onChange={(e) => handleChange(index, "issuer", e.target.value)}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Date
              </label>
              <Input
                type="date"
                value={item.date ? String(item.date).slice(0, 10) : ""}
                onChange={(e) => handleChange(index, "date", e.target.value)}
              />
            </div>
            <Input
              placeholder="Credential URL (optional)"
              value={item.credentialUrl || ""}
              onChange={(e) => handleChange(index, "credentialUrl", e.target.value)}
            />

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-medium text-slate-500">
                Certificate image / PDF (optional)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50">
                  {uploadingIndex === index ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  {uploadingIndex === index ? "Uploading…" : "Upload file"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={uploadingIndex === index}
                    onChange={(e) => onUploadImage(index, e.target.files?.[0])}
                  />
                </label>
                {item.imageUrl ? (
                  <div className="flex items-center gap-2">
                    {String(item.imageUrl).match(/\.(png|jpe?g|gif|webp)(\?|$)/i) ? (
                      <img
                        src={item.imageUrl}
                        alt="Certificate"
                        className="h-12 w-12 rounded object-cover border border-slate-200"
                      />
                    ) : (
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-700 underline"
                      >
                        View uploaded file
                      </a>
                    )}
                    <button
                      type="button"
                      className="cursor-pointer rounded-full border border-slate-200 p-1 text-slate-500 hover:bg-slate-100"
                      onClick={() => handleChange(index, "imageUrl", "")}
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => sync([...list, { ...emptyCert }])}
          >
            <PlusIcon className="h-4 w-4" /> Add
          </Button>
          {list.length > 1 && (
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => sync(list.slice(0, -1))}
            >
              <MinusIcon className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer app-btn-accent"
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Certifications;
