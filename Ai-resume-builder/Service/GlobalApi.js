import axios from 'axios';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api').replace(/\/$/, '');

let currentUserEmail = '';

export const setApiUserEmail = (email) => {
  currentUserEmail = (email || '').trim().toLowerCase();
};

const axiosClient = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

axiosClient.interceptors.request.use((config) => {
  if (currentUserEmail) {
    config.headers['X-User-Email'] = currentUserEmail;
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

export const updateResumeDetail = (id, data) => axiosClient.put(`/user-resumes/${id}`, data);

export const getResumeById = (id) =>
  axiosClient.get(`/user-resumes/${id}`, {
    params: { populate: '*' },
  });

/** Public share view — no ownership header required */
export const getPublicResumeById = (id) =>
  axiosClient.get(`/user-resumes/public/${id}`);

export const deleteResume = (id) => axiosClient.delete(`/user-resumes/${id}`);

export const generateSummaryFromAI = (jobTitle) =>
  axiosClient.post('/ai/summary', { jobTitle });

export const generateExperienceFromAI = (title) =>
  axiosClient.post('/ai/experience', { title });

export default {
  createNewResume,
  getUserResumes,
  updateResumeDetail,
  getResumeById,
  getPublicResumeById,
  deleteResume,
  generateSummaryFromAI,
  generateExperienceFromAI,
  setApiUserEmail,
};
