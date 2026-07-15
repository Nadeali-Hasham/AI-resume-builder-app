import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../Service/GlobalApi";

const mapResumeFromApi = (apiData) => {
  if (!apiData) return null;

  return {
    ...apiData,
    firstName: apiData.firstName || "",
    lastName: apiData.lastName || "",
    jobTitle: apiData.jobTitle || "",
    address: apiData.address || "",
    phone: apiData.phone || "",
    email: apiData.email || "",
    summary: apiData.summary || "",
    themeColor: apiData.themeColor || "#ff6666",
    experience: apiData.Experience || apiData.experience || [],
    education: apiData.Education || apiData.education || [],
    skills: apiData.skills || [],
  };
};

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
        setResumeInfo({
          firstName: "",
          lastName: "",
          jobTitle: "",
          address: "",
          phone: "",
          email: "",
          summary: "",
          themeColor: "#ff6666",
          experience: [],
          education: [],
          skills: [],
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.resumeId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading resume...
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
