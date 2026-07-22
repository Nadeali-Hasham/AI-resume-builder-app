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
    linkedin: apiData.linkedin || "",
    github: apiData.github || "",
    portfolio: apiData.portfolio || "",
    summary: apiData.summary || "",
    themeColor: apiData.themeColor || "#0f766e",
    template: apiData.template || "classic",
    shareToken: apiData.shareToken || "",
    experience: apiData.Experience || apiData.experience || [],
    education: apiData.Education || apiData.education || [],
    skills: apiData.skills || [],
    projects: apiData.projects || [],
    certifications: apiData.certifications || [],
    languages: apiData.languages || [],
  };
};

export const emptyResumeInfo = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  address: "",
  phone: "",
  email: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  themeColor: "#0f766e",
  template: "classic",
  shareToken: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};
