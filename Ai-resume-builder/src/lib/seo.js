/**
 * Site SEO defaults. Set VITE_BASE_URL to your live origin for canonicals / OG.
 */
export const SITE_NAME = "AI Resume Builder";
export const SITE_CREATOR = "Nade Ali Hasham";

export const DEFAULT_DESCRIPTION =
  "Free AI resume builder by Nade Ali Hasham — create ATS-friendly resumes with live preview, templates, PDF download, and shareable links.";

export const DEFAULT_KEYWORDS = [
  "AI resume builder",
  "free resume builder",
  "ATS resume",
  "online CV maker",
  "resume PDF download",
  "Nade Ali Hasham",
  "professional resume templates",
].join(", ");

export const getSiteOrigin = () => {
  const fromEnv = (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
};

export const absoluteUrl = (path = "/") => {
  const origin = getSiteOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${normalized}` : normalized;
};

export const PAGE_SEO = {
  home: {
    title: "AI Resume Builder by Nade Ali Hasham | Free ATS Resume Maker",
    description: DEFAULT_DESCRIPTION,
    path: "/",
  },
  terms: {
    title: "Terms and Conditions | AI Resume Builder",
    description:
      "Terms and Conditions for AI Resume Builder by Nade Ali Hasham — accounts, AI features, sharing, and acceptable use.",
    path: "/terms",
  },
  signIn: {
    title: "Sign In | AI Resume Builder",
    description: "Sign in to AI Resume Builder to create and manage your resumes.",
    path: "/auth/sign-in",
    noIndex: true,
  },
  dashboard: {
    title: "Dashboard | AI Resume Builder",
    description: "Manage your resumes in AI Resume Builder.",
    path: "/dashboard",
    noIndex: true,
  },
  notFound: {
    title: "Page Not Found | AI Resume Builder",
    description: "This page could not be found.",
    path: "/404",
    noIndex: true,
  },
};
