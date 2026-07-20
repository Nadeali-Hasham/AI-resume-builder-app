import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { emptyResumeInfo, mapResumeFromApi } from "@/lib/mapResumeFromApi";

const EditResume = () => {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.resumeId) return;

    setLoading(true);
    GlobalApi.getResumeById(params.resumeId)
      .then((response) => {
        const apiData = response?.data?.data;
        setResumeInfo(mapResumeFromApi(apiData));
      })
      .catch((error) => {
        console.error("Error loading resume:", error);
        setResumeInfo(emptyResumeInfo);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.resumeId]);

  if (loading) {
    return (
      <div className="app-page flex items-center justify-center p-10 app-subtitle">
        Loading resume...
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="app-page">
        <div className="app-shell max-w-[1400px]">
          <div className="mb-6">
            <h1 className="app-title text-2xl md:text-3xl">Edit Resume</h1>
            <p className="app-subtitle mt-1 text-sm">
              Update your details on the left and review the live preview on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <FormSection />
            <div className="app-preview-frame sticky top-24">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
