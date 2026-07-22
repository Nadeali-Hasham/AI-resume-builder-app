import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { mapResumeFromApi } from "@/lib/mapResumeFromApi";
import { Button } from "@/components/ui/button";

const getDefaultZoom = () => {
  if (typeof window === "undefined") return 0.72;
  if (window.innerWidth < 480) return 0.55;
  if (window.innerWidth < 768) return 0.65;
  return 0.72;
};

const EditResume = () => {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mobileTab, setMobileTab] = useState("form");
  const [zoom, setZoom] = useState(getDefaultZoom);
  const [fitZoom, setFitZoom] = useState(getDefaultZoom);

  useEffect(() => {
    const onResize = () => {
      const next = getDefaultZoom();
      setFitZoom(next);
      setZoom((z) => (z === 1 || z === 1.15 ? z : next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!params.resumeId) return;

    setLoading(true);
    setLoadError(false);
    GlobalApi.getResumeById(params.resumeId)
      .then((response) => {
        const apiData = response?.data?.data;
        const mapped = mapResumeFromApi(apiData);
        setResumeInfo(mapped);
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
      <div className="app-page flex items-center justify-center p-6 app-subtitle sm:p-10">
        Loading resume...
      </div>
    );
  }

  if (loadError || !resumeInfo) {
    return (
      <div className="app-page flex flex-col items-center justify-center gap-4 p-6 sm:p-10">
        <p className="app-subtitle text-center">Failed to load this resume.</p>
        <Link to="/dashboard">
          <Button className="app-btn-dark cursor-pointer">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="app-page overflow-x-hidden">
        <div className="app-shell max-w-[1400px]">
          <div className="mb-3 md:mb-6">
            <h1 className="app-title text-xl sm:text-2xl md:text-3xl">Edit Resume</h1>
            <p className="app-subtitle mt-1 text-xs sm:text-sm">
              Update details and review the live preview.
            </p>
          </div>

          <div className="mb-3 flex gap-2 lg:hidden">
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

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
            <div className={`min-w-0 ${mobileTab === "form" ? "block" : "hidden lg:block"}`}>
              <FormSection />
            </div>
            <div
              className={`min-w-0 lg:sticky lg:top-20 ${
                mobileTab === "preview" ? "block" : "hidden lg:block"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Live preview
                </p>
                <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                  {[
                    { label: "Fit", value: fitZoom, isFit: true },
                    { label: "100%", value: 1 },
                    { label: "125%", value: 1.15 },
                  ].map((opt) => {
                    const active = opt.isFit
                      ? zoom !== 1 && zoom !== 1.15
                      : zoom === opt.value;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setZoom(opt.value)}
                        className={`cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition sm:px-2.5 ${
                          active
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="app-preview-paper">
                <div
                  className="app-preview-scale-wrap"
                  style={{ ["--preview-zoom"]: zoom }}
                >
                  <div className="app-preview-scale-inner">
                    <ResumePreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
