import axios from 'axios';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

const axiosClient = axios.create({
    baseURL: 'http://localhost:1337/api/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export const createNewResume = (data) => axiosClient.post('/user-resumes', data);

export const getUserResumes = (userEmail) => axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${encodeURIComponent(userEmail)}`);
// export const getUserResumes = (userEmail) => {
//     return axiosClient.get('/user-resumes', {
//         params: {
//             'filters[userEmail][$eq]': userEmail,
//             'populate': '*'
//         }
//     });
// };

export const updateResumeDetail = (id, data) => axiosClient.put(`/user-resumes/${id}`, data);

export default {
    createNewResume,
    getUserResumes,
    updateResumeDetail
};
