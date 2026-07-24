/**
 * Custom routes: public share, AI, duplicate, rotate share token
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
      path: '/user-resumes/:id/duplicate',
      handler: 'user-resume.duplicate',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-resumes/:id/rotate-share',
      handler: 'user-resume.rotateShareToken',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-resumes/upload',
      handler: 'user-resume.uploadFile',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-resumes/:id/enable-ai',
      handler: 'user-resume.enableAi',
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
