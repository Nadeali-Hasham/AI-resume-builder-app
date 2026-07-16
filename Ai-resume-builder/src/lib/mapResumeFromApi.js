export const mapResumeFromApi = (apiData) => {
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

export const emptyResumeInfo = {
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
};
