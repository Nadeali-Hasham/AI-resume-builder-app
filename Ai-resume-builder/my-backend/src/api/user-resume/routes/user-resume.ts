/**
 * user-resume router — auth disabled; Clerk middleware + controller enforce access
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::user-resume.user-resume', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { auth: false },
    update: { auth: false },
    delete: { auth: false },
  },
});
