import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api').replace(
  /\/$/,
  ''
);

let getAuthToken = async () => null;
let currentUserEmail = '';
let saveStatusListener = null;

export const setAuthTokenGetter = (fn) => {
  getAuthToken = typeof fn === 'function' ? fn : async () => null;
};

export const setApiUserEmail = (email) => {
  currentUserEmail = (email || '').trim().toLowerCase();
};

/** 'idle' | 'saving' | 'saved' | 'error' */
export const setSaveStatusListener = (fn) => {
  saveStatusListener = typeof fn === 'function' ? fn : null;
};

const notifySave = (status) => {
  try {
    saveStatusListener?.(status);
  } catch {
    /* ignore */
  }
};

const axiosClient = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  if (currentUserEmail) {
    config.headers['X-User-Email'] = currentUserEmail;
  }
  // Let the browser set multipart boundary for FormData
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

export const createNewResume = (data) => axiosClient.post('/user-resumes', data);

export const getUserResumes = () =>
  axiosClient.get('/user-resumes', {
    params: {
      'pagination[pageSize]': 100,
      sort: 'updatedAt:desc',
    },
  });

export const updateResumeDetail = async (id, data) => {
  notifySave('saving');
  try {
    const res = await axiosClient.put(`/user-resumes/${id}`, data);
    notifySave('saved');
    return res;
  } catch (err) {
    notifySave('error');
    throw err;
  }
};

export const getResumeById = (id) =>
  axiosClient.get(`/user-resumes/${id}`, {
    params: { populate: '*' },
  });

export const getPublicResumeById = (shareToken) =>
  axiosClient.get(`/user-resumes/public/${shareToken}`);

export const deleteResume = (id) => axiosClient.delete(`/user-resumes/${id}`);

export const duplicateResume = (id, resumeId) =>
  axiosClient.post(`/user-resumes/${id}/duplicate`, { resumeId });

export const rotateShareToken = (id) =>
  axiosClient.post(`/user-resumes/${id}/rotate-share`);

export const enableResumeAi = (id) =>
  axiosClient.post(`/user-resumes/${id}/enable-ai`);

export const uploadFile = (file) => {
  const form = new FormData();
  form.append('files', file);
  return axiosClient.post('/user-resumes/upload', form);
};

export const generateSummaryFromAI = ({
  resumeId,
  jobTitle,
  jobDescription = '',
  currentSummary = '',
} = {}) =>
  axiosClient.post('/ai/summary', {
    resumeId,
    jobTitle,
    jobDescription,
    currentSummary,
  });

export const generateExperienceFromAI = ({
  resumeId,
  title,
  jobDescription = '',
  currentHtml = '',
  companyName = '',
} = {}) =>
  axiosClient.post('/ai/experience', {
    resumeId,
    title,
    jobDescription,
    currentHtml,
    companyName,
  });

export default {
  createNewResume,
  getUserResumes,
  updateResumeDetail,
  getResumeById,
  getPublicResumeById,
  deleteResume,
  duplicateResume,
  rotateShareToken,
  enableResumeAi,
  uploadFile,
  generateSummaryFromAI,
  generateExperienceFromAI,
  setAuthTokenGetter,
  setApiUserEmail,
  setSaveStatusListener,
};
