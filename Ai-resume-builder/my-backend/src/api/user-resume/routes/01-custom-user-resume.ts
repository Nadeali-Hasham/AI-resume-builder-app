/**
 * Custom routes: public view + AI (server-side key)
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/user-resumes/public/:id',
      handler: 'user-resume.publicFind',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/ai/summary',
      handler: 'user-resume.generateSummary',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/ai/experience',
      handler: 'user-resume.generateExperience',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
