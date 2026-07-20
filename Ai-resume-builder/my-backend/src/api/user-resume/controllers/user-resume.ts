/**
 * user-resume controller with ownership checks
 */

import { factories } from '@strapi/strapi';

const getUserEmail = (ctx: any) => {
  const headerEmail = ctx.request.header['x-user-email'];
  if (typeof headerEmail === 'string' && headerEmail.trim()) {
    return headerEmail.trim().toLowerCase();
  }
  return null;
};

export default factories.createCoreController(
  'api::user-resume.user-resume',
  ({ strapi }) => ({
    async find(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      ctx.query = {
        ...ctx.query,
        filters: {
          ...(typeof ctx.query.filters === 'object' ? ctx.query.filters : {}),
          userEmail: { $eq: userEmail },
        },
      };

      return await super.find(ctx);
    },

    async findOne(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      const { id } = ctx.params;
      const entity = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
        populate: ['Experience', 'Education', 'skills'],
      });

      if (!entity) {
        return ctx.notFound('Resume not found');
      }

      if ((entity.userEmail || '').toLowerCase() !== userEmail) {
        return ctx.forbidden('You do not own this resume');
      }

      ctx.body = { data: entity };
      return ctx.body;
    },

    async create(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      const bodyData = ctx.request.body?.data || {};
      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...bodyData,
          userEmail,
          publishedAt: new Date(),
        },
      };

      return await super.create(ctx);
    },

    async update(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      const { id } = ctx.params;
      const existing = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
      });

      if (!existing) {
        return ctx.notFound('Resume not found');
      }

      if ((existing.userEmail || '').toLowerCase() !== userEmail) {
        return ctx.forbidden('You do not own this resume');
      }

      // Prevent client from changing ownership
      if (ctx.request.body?.data) {
        ctx.request.body.data.userEmail = existing.userEmail;
        ctx.request.body.data.publishedAt =
          ctx.request.body.data.publishedAt || existing.publishedAt || new Date();
      }

      return await super.update(ctx);
    },

    async delete(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      const { id } = ctx.params;
      const existing = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
      });

      if (!existing) {
        return ctx.notFound('Resume not found');
      }

      if ((existing.userEmail || '').toLowerCase() !== userEmail) {
        return ctx.forbidden('You do not own this resume');
      }

      return await super.delete(ctx);
    },

    /** Public read for share links — no private owner fields */
    async publicFind(ctx) {
      const { id } = ctx.params;
      const entity = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
        populate: ['Experience', 'Education', 'skills'],
        status: 'published',
      });

      if (!entity) {
        // Fallback: try without status filter for drafts created earlier
        const draft = await strapi.documents('api::user-resume.user-resume').findOne({
          documentId: id,
          populate: ['Experience', 'Education', 'skills'],
        });
        if (!draft) {
          return ctx.notFound('Resume not found');
        }
        const { userEmail, userName, ...publicDraft } = draft as any;
        return { data: publicDraft };
      }

      const { userEmail, userName, ...publicData } = entity as any;
      return { data: publicData };
    },

    async generateSummary(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
          return ctx.internalServerError('GOOGLE_AI_API_KEY is missing on the server');
        }

        const jobTitle = String(ctx.request.body?.jobTitle || '').trim();
        if (!jobTitle) {
          return ctx.badRequest('jobTitle is required');
        }

        const modelName = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';
        const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: modelName });
        const prompt = `
          Generate a professional resume summary for a ${jobTitle} position.
          Keep it concise (3-4 sentences), professional, and impactful.
          Return only the summary text without any additional formatting.
        `;
        const result = await model.generateContent(prompt);
        ctx.body = { summary: result.response.text().trim() };
      } catch (error: any) {
        strapi.log.error('AI summary failed', error);
        ctx.status = 500;
        ctx.body = { error: error?.message || 'AI summary failed' };
      }
    },

    async generateExperience(ctx) {
      const userEmail = getUserEmail(ctx);
      if (!userEmail) {
        return ctx.unauthorized('Missing X-User-Email header');
      }

      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
          return ctx.internalServerError('GOOGLE_AI_API_KEY is missing on the server');
        }

        const title = String(ctx.request.body?.title || '').trim();
        if (!title) {
          return ctx.badRequest('title is required');
        }

        const modelName = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';
        const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: modelName });
        const prompt = `
          Position title: ${title}.
          Give 5-7 professional resume bullet points for this role.
          Return ONLY valid HTML using a <ul> with <li> items. No markdown.
        `;
        const result = await model.generateContent(prompt);
        let html = result.response.text().trim();
        html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
        ctx.body = { html };
      } catch (error: any) {
        strapi.log.error('AI experience failed', error);
        ctx.status = 500;
        ctx.body = { error: error?.message || 'AI experience failed' };
      }
    },
  })
);
