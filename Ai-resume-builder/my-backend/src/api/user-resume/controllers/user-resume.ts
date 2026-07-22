/**
 * user-resume controller — Clerk ownership, share tokens, AI + limits
 */

import { factories } from '@strapi/strapi';
import {
  checkRateLimit,
  getAiDailyLimit,
  getFreeResumeLimit,
} from '../../../utils/rate-limit';
import { createShareToken } from '../../../utils/share-token';

const POPULATE: any = [
  'Experience',
  'Education',
  'skills',
  'projects',
  'certifications',
  'languages',
];

type AuthUser = { userId: string; email: string | null };

const requireAuth = (ctx: any): AuthUser | null => {
  const userId = ctx.state?.authUserId ? String(ctx.state.authUserId) : '';
  const email = ctx.state?.authEmail
    ? String(ctx.state.authEmail).trim().toLowerCase()
    : null;

  if (!userId) {
    ctx.unauthorized('Sign in required. Missing or invalid Clerk session token.');
    return null;
  }

  return { userId, email };
};

const ownsResume = (entity: any, auth: AuthUser) => {
  if (entity?.clerkUserId && entity.clerkUserId === auth.userId) {
    return true;
  }
  const email = (entity?.userEmail || '').toLowerCase();
  if (auth.email && email === auth.email) {
    return true;
  }
  if (email === `user-${auth.userId.slice(0, 8)}@clerk.local`) {
    return true;
  }
  return false;
};

const ownerFilters = (auth: AuthUser) => {
  const parts: any[] = [{ clerkUserId: { $eq: auth.userId } }];
  if (auth.email) {
    parts.push({ userEmail: { $eq: auth.email } });
  }
  // Resumes created when email wasn't in the JWT yet
  parts.push({
    userEmail: { $eq: `user-${auth.userId.slice(0, 8)}@clerk.local` },
  });
  return { $or: parts };
};

const toPublic = (entity: any) => {
  const { userEmail, userName, clerkUserId, ...rest } = entity;
  return rest;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export default factories.createCoreController(
  'api::user-resume.user-resume',
  ({ strapi }) => ({
    async find(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const load = async (status: 'published' | 'draft') => {
        try {
          return await strapi.documents('api::user-resume.user-resume').findMany({
            filters: ownerFilters(auth) as any,
            populate: POPULATE,
            limit: 100,
            sort: 'updatedAt:desc',
            status,
          });
        } catch {
          return [];
        }
      };

      const [published, drafts] = await Promise.all([
        load('published'),
        load('draft'),
      ]);

      const byId = new Map<string, any>();
      for (const row of [...published, ...drafts]) {
        if (!row?.documentId) continue;
        byId.set(row.documentId, row);
      }

      const merged = Array.from(byId.values()).sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );

      // Backfill clerkUserId so future lists stay stable
      await Promise.all(
        merged.map(async (row) => {
          if (row.clerkUserId === auth.userId) return;
          if (!ownsResume(row, auth)) return;
          try {
            await strapi.documents('api::user-resume.user-resume').update({
              documentId: row.documentId,
              data: { clerkUserId: auth.userId } as any,
              status: row.publishedAt ? 'published' : 'draft',
            });
            row.clerkUserId = auth.userId;
          } catch {
            /* ignore */
          }
        })
      );

      ctx.body = { data: merged };
      return ctx.body;
    },

    async findOne(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const { id } = ctx.params;
      const entity: any = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
        populate: POPULATE,
      });

      if (!entity) {
        return ctx.notFound('Resume not found');
      }

      if (!ownsResume(entity, auth)) {
        return ctx.forbidden('You do not own this resume');
      }

      // Backfill clerkUserId on legacy rows
      if (!entity.clerkUserId) {
        try {
          await strapi.documents('api::user-resume.user-resume').update({
            documentId: id,
            data: { clerkUserId: auth.userId } as any,
          });
          entity.clerkUserId = auth.userId;
        } catch {
          /* ignore */
        }
      }

      // Ensure opaque share token exists
      if (!entity.shareToken) {
        try {
          const shareToken = createShareToken();
          await strapi.documents('api::user-resume.user-resume').update({
            documentId: id,
            data: { shareToken } as any,
          });
          entity.shareToken = shareToken;
        } catch {
          /* ignore */
        }
      }

      ctx.body = { data: entity };
      return ctx.body;
    },

    async create(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const existing = await strapi.documents('api::user-resume.user-resume').findMany({
        filters: ownerFilters(auth) as any,
        limit: 100,
      });

      const limit = getFreeResumeLimit();
      if (existing.length >= limit) {
        return ctx.tooManyRequests(
          `Free plan allows up to ${limit} resumes. Delete one to create another.`
        );
      }

      const bodyData = ctx.request.body?.data || {};
      const userEmail =
        auth.email ||
        (typeof bodyData.userEmail === 'string'
          ? bodyData.userEmail.trim().toLowerCase()
          : '') ||
        `user-${auth.userId.slice(0, 8)}@clerk.local`;

      ctx.request.body = {
        ...ctx.request.body,
        data: {
          ...bodyData,
          userEmail,
          clerkUserId: auth.userId,
          shareToken: bodyData.shareToken || createShareToken(),
          template: bodyData.template || 'classic',
          themeColor: bodyData.themeColor || '#0f766e',
          publishedAt: new Date(),
        },
      };

      return await super.create(ctx);
    },

    async update(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const { id } = ctx.params;
      const existing: any = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
      });

      if (!existing) {
        return ctx.notFound('Resume not found');
      }

      if (!ownsResume(existing, auth)) {
        return ctx.forbidden('You do not own this resume');
      }

      if (ctx.request.body?.data) {
        ctx.request.body.data.userEmail = existing.userEmail;
        ctx.request.body.data.clerkUserId = existing.clerkUserId || auth.userId;
        ctx.request.body.data.shareToken =
          ctx.request.body.data.shareToken ||
          existing.shareToken ||
          createShareToken();
        ctx.request.body.data.publishedAt =
          ctx.request.body.data.publishedAt || existing.publishedAt || new Date();
      }

      return await super.update(ctx);
    },

    async delete(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const { id } = ctx.params;
      const existing: any = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
      });

      if (!existing) {
        return ctx.notFound('Resume not found');
      }

      if (!ownsResume(existing, auth)) {
        return ctx.forbidden('You do not own this resume');
      }

      return await super.delete(ctx);
    },

    /** Public read by opaque shareToken */
    async publicFind(ctx) {
      const { id } = ctx.params;
      const token = String(id || '').trim();
      if (!token) {
        return ctx.badRequest('share token required');
      }

      const matches: any[] = await strapi.documents('api::user-resume.user-resume').findMany({
        filters: { shareToken: { $eq: token } } as any,
        populate: POPULATE,
        limit: 1,
      });

      const entity: any = matches[0];

      if (!entity) {
        return ctx.notFound('Resume not found');
      }

      return { data: toPublic(entity) };
    },

    async rotateShareToken(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const { id } = ctx.params;
      const existing: any = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
      });

      if (!existing) {
        return ctx.notFound('Resume not found');
      }
      if (!ownsResume(existing, auth)) {
        return ctx.forbidden('You do not own this resume');
      }

      const shareToken = createShareToken();
      const updated: any = await strapi.documents('api::user-resume.user-resume').update({
        documentId: id,
        data: { shareToken } as any,
      });

      ctx.body = { data: { shareToken: updated?.shareToken || shareToken } };
      return ctx.body;
    },

    async duplicate(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const limit = getFreeResumeLimit();
      const existingCount = await strapi.documents('api::user-resume.user-resume').findMany({
        filters: ownerFilters(auth) as any,
        limit: 100,
      });
      if (existingCount.length >= limit) {
        return ctx.tooManyRequests(
          `Free plan allows up to ${limit} resumes. Delete one to duplicate.`
        );
      }

      const { id } = ctx.params;
      const source: any = await strapi.documents('api::user-resume.user-resume').findOne({
        documentId: id,
        populate: POPULATE,
      });

      if (!source) {
        return ctx.notFound('Resume not found');
      }
      if (!ownsResume(source, auth)) {
        return ctx.forbidden('You do not own this resume');
      }

      const stripIds = (items: any[] | undefined) =>
        (items || []).map(({ id: _id, ...rest }) => rest);

      const newResumeId =
        String(ctx.request.body?.resumeId || '').trim() ||
        `dup-${Date.now().toString(36)}`;

      const userEmail =
        auth.email || source.userEmail || `user-${auth.userId.slice(0, 8)}@clerk.local`;

      const created = await strapi.documents('api::user-resume.user-resume').create({
        data: {
          title: `${source.title || 'Resume'} (Copy)`,
          resumeId: newResumeId,
          shareToken: createShareToken(),
          clerkUserId: auth.userId,
          userEmail,
          userName: source.userName,
          firstName: source.firstName,
          lastName: source.lastName,
          jobTitle: source.jobTitle,
          address: source.address,
          phone: source.phone,
          email: source.email,
          linkedin: source.linkedin,
          github: source.github,
          portfolio: source.portfolio,
          summary: source.summary,
          themeColor: source.themeColor || '#0f766e',
          template: source.template || 'classic',
          Experience: stripIds(source.Experience),
          Education: stripIds(source.Education),
          skills: stripIds(source.skills),
          projects: stripIds(source.projects),
          certifications: stripIds(source.certifications),
          languages: stripIds(source.languages),
          publishedAt: new Date(),
        } as any,
      });

      ctx.body = { data: created };
      return ctx.body;
    },

    async generateSummary(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const aiLimit = getAiDailyLimit();
      const ip = ctx.request.ip || 'unknown';
      const rateKey = `ai:${auth.userId}:${ip}`;
      const limited = checkRateLimit(rateKey, aiLimit, DAY_MS);
      if (!limited.allowed) {
        ctx.set('Retry-After', String(limited.retryAfterSec));
        return ctx.tooManyRequests(
          `AI daily limit (${aiLimit}) reached. Try again in ${limited.retryAfterSec}s.`
        );
      }

      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
          return ctx.internalServerError('GOOGLE_AI_API_KEY is missing on the server');
        }

        const jobTitle = String(ctx.request.body?.jobTitle || '').trim().slice(0, 200);
        const jobDescription = String(ctx.request.body?.jobDescription || '')
          .trim()
          .slice(0, 4000);
        const currentSummary = String(ctx.request.body?.currentSummary || '')
          .trim()
          .slice(0, 4000);

        if (!jobTitle && !jobDescription) {
          return ctx.badRequest('jobTitle or jobDescription is required');
        }

        const modelName = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';
        const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: modelName });
        const prompt = `
You write professional resume summaries.
Target role: ${jobTitle || 'the role in the job description'}.
${jobDescription ? `Job description to tailor toward:\n${jobDescription}\n` : ''}
${currentSummary ? `Existing summary to improve (keep truthful):\n${currentSummary}\n` : ''}
Return EXACTLY 3 alternative summaries as a JSON array of strings.
Each summary: 3-4 sentences, impactful, no markdown, no labels.
Example: ["summary one","summary two","summary three"]
`;
        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim();
        let options: string[] = [];
        try {
          const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, ''));
          if (Array.isArray(parsed)) {
            options = parsed.map((s) => String(s).trim()).filter(Boolean).slice(0, 3);
          }
        } catch {
          options = [raw];
        }
        if (!options.length) {
          options = [raw];
        }
        ctx.body = { summary: options[0], options, remaining: limited.remaining };
      } catch (error: any) {
        strapi.log.error('AI summary failed', error);
        ctx.status = 502;
        ctx.body = { error: 'AI summary failed' };
      }
    },

    async generateExperience(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const aiLimit = getAiDailyLimit();
      const ip = ctx.request.ip || 'unknown';
      const limited = checkRateLimit(`ai:${auth.userId}:${ip}`, aiLimit, DAY_MS);
      if (!limited.allowed) {
        ctx.set('Retry-After', String(limited.retryAfterSec));
        return ctx.tooManyRequests(
          `AI daily limit (${aiLimit}) reached. Try again in ${limited.retryAfterSec}s.`
        );
      }

      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
          return ctx.internalServerError('GOOGLE_AI_API_KEY is missing on the server');
        }

        const title = String(ctx.request.body?.title || '').trim().slice(0, 200);
        const jobDescription = String(ctx.request.body?.jobDescription || '')
          .trim()
          .slice(0, 4000);
        const currentHtml = String(ctx.request.body?.currentHtml || '')
          .trim()
          .slice(0, 8000);
        const companyName = String(ctx.request.body?.companyName || '')
          .trim()
          .slice(0, 200);

        if (!title && !jobDescription) {
          return ctx.badRequest('title or jobDescription is required');
        }

        const modelName = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';
        const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: modelName });
        const prompt = `
Write resume bullet points for position: ${title || 'role'}.
${companyName ? `Company: ${companyName}.` : ''}
${jobDescription ? `Tailor toward this job description:\n${jobDescription}\n` : ''}
${currentHtml ? `Improve these existing bullets (keep truthful):\n${currentHtml}\n` : ''}
Return EXACTLY 3 alternative versions as a JSON array of strings.
Each string must be ONLY valid HTML: a <ul> with 5-7 <li> items. No markdown fences.
Example: ["<ul><li>a</li></ul>","<ul><li>b</li></ul>","<ul><li>c</li></ul>"]
`;
        const result = await model.generateContent(prompt);
        let raw = result.response.text().trim();
        raw = raw.replace(/^```json\s*/i, '').replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
        let options: string[] = [];
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            options = parsed.map((s) => String(s).trim()).filter(Boolean).slice(0, 3);
          }
        } catch {
          options = [raw];
        }
        if (!options.length) {
          options = [raw];
        }
        ctx.body = { html: options[0], options, remaining: limited.remaining };
      } catch (error: any) {
        strapi.log.error('AI experience failed', error);
        ctx.status = 500;
        ctx.status = 502;
        ctx.body = { error: 'AI experience failed' };
      }
    },
  })
);
