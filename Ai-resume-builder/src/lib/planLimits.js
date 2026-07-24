/** Plan limits shown in UI — keep in sync with backend defaults */
export const AI_RESUME_LIMIT = 5;
/** @deprecated alias — AI-enabled resume slots */
export const FREE_RESUME_LIMIT = AI_RESUME_LIMIT;
export const AI_DAILY_LIMIT = 20;
export const AI_JD_MAX_CHARS = 4000;

export const apiErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  const nested = data?.error;
  if (typeof nested === "string" && nested.trim()) return nested;
  if (nested?.message) return nested.message;
  if (typeof data?.message === "string") return data.message;
  if (typeof data === "string" && data.trim()) return data;
  return error?.message || fallback;
};

export const isAiEnabledResume = (resume) => {
  const d = resume?.attributes || resume || {};
  return Boolean(d.aiEnabled);
};
