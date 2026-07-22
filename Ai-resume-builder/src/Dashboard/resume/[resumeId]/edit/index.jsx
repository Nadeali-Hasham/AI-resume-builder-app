import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { emptyResumeInfo, mapResumeFromApi } from "@/lib/mapResumeFromApi";
import { Button } from "@/components/ui/button";

const EditResume = () => {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mobileTab, setMobileTab] = useState("form");

  useEffect(() => {
    if (!params.resumeId) return;

    setLoading(true);
    setLoadError(false);
    GlobalApi.getResumeById(params.resumeId)
      .then((response) => {
        const apiData = response?.data?.data;
        const mapped = mapResumeFromApi(apiData);
        setResumeInfo(mapped);
        // Backfill share token if missing (legacy rows)
        if (apiData?.documentId && !apiData?.shareToken) {
          GlobalApi.rotateShareToken(apiData.documentId)
            .then((r) => {
              const token = r?.data?.data?.shareToken;
              if (token) {
                setResumeInfo((prev) => ({ ...prev, shareToken: token }));
              }
            })
            .catch(() => {});
        }
      })
      .catch((error) => {
        console.error("Error loading resume:", error);
        setLoadError(true);
        setResumeInfo(null);
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

  if (loadError || !resumeInfo) {
    return (
      <div className="app-page flex flex-col items-center justify-center gap-4 p-10">
        <p className="app-subtitle">Failed to load this resume.</p>
        <Link to="/dashboard">
          <Button className="app-btn-dark cursor-pointer">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="app-page">
        <div className="app-shell max-w-[1400px]">
          <div className="mb-4 md:mb-6">
            <h1 className="app-title text-2xl md:text-3xl">Edit Resume</h1>
            <p className="app-subtitle mt-1 text-sm">
              Update details and review the live preview.
            </p>
          </div>

          <div className="mb-4 flex gap-2 lg:hidden">
            <Button
              type="button"
              size="sm"
              className={`cursor-pointer flex-1 ${mobileTab === "form" ? "app-btn-accent" : "app-btn-dark"}`}
              onClick={() => setMobileTab("form")}
            >
              Form
            </Button>
            <Button
              type="button"
              size="sm"
              className={`cursor-pointer flex-1 ${mobileTab === "preview" ? "app-btn-accent" : "app-btn-dark"}`}
              onClick={() => setMobileTab("preview")}
            >
              Preview
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className={mobileTab === "form" ? "block" : "hidden lg:block"}>
              <FormSection />
            </div>
            <div
              className={`app-preview-frame lg:sticky lg:top-24 ${
                mobileTab === "preview" ? "block" : "hidden lg:block"
              }`}
            >
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
