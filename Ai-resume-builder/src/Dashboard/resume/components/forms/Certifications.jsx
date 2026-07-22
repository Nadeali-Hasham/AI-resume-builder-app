import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, MinusIcon, PlusIcon, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import GlobalApi from "./../../../../../Service/GlobalApi";

const emptyCert = { name: "", issuer: "", date: "", credentialUrl: "" };

const Certifications = ({ enableNextButton, requireSaveForNext = true }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [list, setList] = useState([{ ...emptyCert }]);
  const [loading, setLoading] = useState(false);

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

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = list
        .map(({ id, ...rest }) => rest)
        .filter((c) => c.name?.trim());
      await GlobalApi.updateResumeDetail(params.resumeId, {
        data: { certifications: payload },
      });
      enableNextButton?.(true);
      toast.success("Certifications saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save certifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-form-panel">
      <h2 className="app-form-title">Certifications</h2>
      <p className="app-form-desc">Credentials that strengthen your profile.</p>
      <form onSubmit={onSave} className="mt-4 space-y-6">
        {list.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
            <Input placeholder="Certificate name" value={item.name || ""} onChange={(e) => handleChange(index, "name", e.target.value)} />
            <Input placeholder="Issuer" value={item.issuer || ""} onChange={(e) => handleChange(index, "issuer", e.target.value)} />
            <Input placeholder="Date" value={item.date || ""} onChange={(e) => handleChange(index, "date", e.target.value)} />
            <Input placeholder="Credential URL" value={item.credentialUrl || ""} onChange={(e) => handleChange(index, "credentialUrl", e.target.value)} />
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => sync([...list, { ...emptyCert }])}>
            <PlusIcon className="h-4 w-4" /> Add
          </Button>
          {list.length > 1 && (
            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => sync(list.slice(0, -1))}>
              <MinusIcon className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>
        <Button type="submit" className="w-full cursor-pointer app-btn-accent" disabled={loading}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Certifications;
