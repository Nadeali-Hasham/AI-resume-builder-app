/**
 * user-resume controller — Clerk ownership, share tokens, AI + limits
 */

import { factories } from '@strapi/strapi';
import {
  checkRateLimit,
  getAiDailyLimit,
  getAiResumeLimit,
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
  parts.push({
    userEmail: { $eq: `user-${auth.userId.slice(0, 8)}@clerk.local` },
  });
  return { $or: parts };
};

const countAiResumes = async (strapi: any, auth: AuthUser) => {
  const load = async (status: 'published' | 'draft') => {
    try {
      return await strapi.documents('api::user-resume.user-resume').findMany({
        filters: {
          $and: [ownerFilters(auth), { aiEnabled: { $eq: true } }],
        } as any,
        limit: 100,
        status,
      });
    } catch {
      return [];
    }
  };
  const [published, drafts] = await Promise.all([load('published'), load('draft')]);
  const ids = new Set<string>();
  for (const row of [...published, ...drafts]) {
    if (row?.documentId) ids.add(row.documentId);
  }
  return ids.size;
};

const requireOwnedResume = async (strapi: any, ctx: any, auth: AuthUser) => {
  const resumeId = String(
    ctx.request.body?.resumeId || ctx.params?.id || ''
  ).trim();
  if (!resumeId) {
    ctx.badRequest('resumeId is required');
    return null;
  }
  const entity: any = await strapi.documents('api::user-resume.user-resume').findOne({
    documentId: resumeId,
  });
  if (!entity) {
    ctx.notFound('Resume not found');
    return null;
  }
  if (!ownsResume(entity, auth)) {
    ctx.forbidden('You do not own this resume');
    return null;
  }
  return entity;
};

const toPublic = (entity: any) => {
  const { userEmail, userName, clerkUserId, ...rest } = entity;
  return rest;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const asCleanString = (value: unknown) => String(value ?? '').trim();

const sanitizeComponentList = (
  items: any[] | undefined,
  fields: string[]
): any[] | undefined => {
  if (!Array.isArray(items)) return items;
  return items
    .map((item) => {
      const next: Record<string, unknown> = {};
      for (const field of fields) {
        const raw = item?.[field];
        if (field === 'date') {
          const d = asCleanString(raw);
          next[field] = /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(0, 10) : d || '';
          continue;
        }
        if (field === 'rating') {
          const n = Number(raw);
          next[field] = Number.isFinite(n) ? Math.max(1, Math.min(5, n)) : 3;
          continue;
        }
        next[field] = raw == null ? '' : raw;
      }
      return next;
    })
    .filter((item) =>
      ['name', 'title', 'universityName'].some((key) => asCleanString(item[key]))
    );
};

const sanitizeUpdateData = (data: any) => {
  if (!data || typeof data !== 'object') return data;
  const next = { ...data };

  if (next.languages) {
    next.languages = sanitizeComponentList(next.languages, ['name', 'proficiency']);
  }
  if (next.certifications) {
    next.certifications = sanitizeComponentList(next.certifications, [
      'name',
      'issuer',
      'date',
      'credentialUrl',
      'imageUrl',
    ]);
  }
  if (next.projects) {
    next.projects = sanitizeComponentList(next.projects, [
      'name',
      'description',
      'technologies',
      'link',
      'githubUrl',
    ]);
  }
  if (next.skills) {
    next.skills = sanitizeComponentList(next.skills, ['name', 'rating']);
  }
  if (next.Experience) {
    next.Experience = sanitizeComponentList(next.Experience, [
      'title',
      'companyName',
      'city',
      'state',
      'startDate',
      'endDate',
      'workSummary',
    ]);
  }
  if (next.experience) {
    next.Experience = sanitizeComponentList(next.experience, [
      'title',
      'companyName',
      'city',
      'state',
      'startDate',
      'endDate',
      'workSummary',
    ]);
    delete next.experience;
  }
  if (next.Education) {
    next.Education = sanitizeComponentList(next.Education, [
      'universityName',
      'degree',
      'major',
      'startDate',
      'endDate',
      'description',
    ]);
  }
  if (next.education) {
    next.Education = sanitizeComponentList(next.education, [
      'universityName',
      'degree',
      'major',
      'startDate',
      'endDate',
      'description',
    ]);
    delete next.education;
  }

  return next;
};

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

      const bodyData = ctx.request.body?.data || {};
      const wantAi = Boolean(bodyData.aiEnabled);
      const aiLimit = getAiResumeLimit();

      if (wantAi) {
        const aiCount = await countAiResumes(strapi, auth);
        if (aiCount >= aiLimit) {
          return ctx.tooManyRequests(
            `AI plan allows up to ${aiLimit} AI resumes. Create a manual resume (unlimited) or delete an AI resume.`
          );
        }
      }

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
          aiEnabled: wantAi,
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
        populate: POPULATE,
      });

      if (!existing) {
        return ctx.notFound('Resume not found');
      }

      if (!ownsResume(existing, auth)) {
        return ctx.forbidden('You do not own this resume');
      }

      const bodyData = ctx.request.body?.data;
      if (!bodyData || typeof bodyData !== 'object') {
        return ctx.badRequest('Missing data payload');
      }

      const nextAi = bodyData.aiEnabled;
      if (nextAi === true && !existing.aiEnabled) {
        const aiLimit = getAiResumeLimit();
        const aiCount = await countAiResumes(strapi, auth);
        if (aiCount >= aiLimit) {
          return ctx.tooManyRequests(
            `AI plan allows up to ${aiLimit} AI resumes. Disable AI on another resume first.`
          );
        }
      }

      const data = sanitizeUpdateData(bodyData);
      // Ownership / share fields are server-controlled
      delete data.userEmail;
      delete data.clerkUserId;
      delete data.shareToken;
      delete data.publishedAt;
      delete data.documentId;
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;

      data.clerkUserId = existing.clerkUserId || auth.userId;
      if (!existing.shareToken) {
        data.shareToken = createShareToken();
      }
      if (typeof nextAi !== 'boolean') {
        delete data.aiEnabled;
      }

      const status = existing.publishedAt ? 'published' : 'draft';

      try {
        const updated = await strapi.documents('api::user-resume.user-resume').update({
          documentId: id,
          data: data as any,
          status,
          populate: POPULATE,
        });
        ctx.body = { data: updated };
        return ctx.body;
      } catch (error: any) {
        strapi.log.error('Resume update failed', {
          message: error?.message,
          name: error?.name,
          details: error?.details,
        });
        const message =
          error?.message ||
          error?.details?.errors?.[0]?.message ||
          'Failed to update resume';
        return ctx.badRequest(message);
      }
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

      // Duplicates are always manual (unlimited). Enable AI later if slots remain.
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
          aiEnabled: false,
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

    async uploadFile(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const file =
        ctx.request.files?.files ||
        ctx.request.files?.file ||
        ctx.request.files?.image;

      if (!file) {
        return ctx.badRequest('No file uploaded. Use field name "files".');
      }

      const files = Array.isArray(file) ? file : [file];
      const first = files[0] as {
        mimetype?: string | null;
        mime?: string;
        type?: string;
        originalFilename?: string | null;
        name?: string;
        filepath?: string;
      };
      const mime = String(first?.mimetype || first?.mime || first?.type || '');
      if (!mime.startsWith('image/') && mime !== 'application/pdf') {
        return ctx.badRequest('Only images or PDF are allowed');
      }

      try {
        const uploaded = await strapi.plugin('upload').service('upload').upload({
          data: {
            fileInfo: {
              name: first.originalFilename || first.name || 'certificate',
              alternativeText: 'Certificate',
              caption: `Uploaded by ${auth.userId}`,
            },
          },
          files: first as any,
        });

        const item = Array.isArray(uploaded) ? uploaded[0] : uploaded;
        if (!item) {
          return ctx.internalServerError('Upload failed');
        }

        const base = `${ctx.request.protocol}://${ctx.request.get('host')}`;
        const url = item.url?.startsWith('http')
          ? item.url
          : `${base}${item.url}`;

        ctx.body = {
          data: {
            id: item.id,
            url,
            name: item.name,
            mime: item.mime,
          },
        };
        return ctx.body;
      } catch (error: any) {
        strapi.log.error('Upload failed', error);
        return ctx.internalServerError('Upload failed');
      }
    },

    async enableAi(ctx) {
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

      if (existing.aiEnabled) {
        ctx.body = { data: { aiEnabled: true, alreadyEnabled: true } };
        return ctx.body;
      }

      const aiLimit = getAiResumeLimit();
      const aiCount = await countAiResumes(strapi, auth);
      if (aiCount >= aiLimit) {
        return ctx.tooManyRequests(
          `AI plan allows up to ${aiLimit} AI resumes. Delete or disable AI on another resume first.`
        );
      }

      await strapi.documents('api::user-resume.user-resume').update({
        documentId: id,
        data: { aiEnabled: true } as any,
        status: existing.publishedAt ? 'published' : 'draft',
      });

      ctx.body = {
        data: {
          aiEnabled: true,
          documentId: id,
          aiSlotsUsed: aiCount + 1,
          aiSlotsLimit: aiLimit,
        },
      };
      return ctx.body;
    },

    async generateSummary(ctx) {
      const auth = requireAuth(ctx);
      if (!auth) return;

      const resume = await requireOwnedResume(strapi, ctx, auth);
      if (!resume) return;

      if (!resume.aiEnabled) {
        ctx.status = 403;
        ctx.body = {
          error: {
            message:
              'AI is not enabled on this resume. Enable AI (max 5 AI resumes) or create an AI resume.',
            code: 'AI_NOT_ENABLED',
          },
        };
        return;
      }

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

      const resume = await requireOwnedResume(strapi, ctx, auth);
      if (!resume) return;

      if (!resume.aiEnabled) {
        ctx.status = 403;
        ctx.body = {
          error: {
            message:
              'AI is not enabled on this resume. Enable AI (max 5 AI resumes) or create an AI resume.',
            code: 'AI_NOT_ENABLED',
          },
        };
        return;
      }

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
        raw = raw
          .replace(/^```json\s*/i, '')
          .replace(/^```html\s*/i, '')
          .replace(/\s*```$/i, '');
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
        ctx.status = 502;
        ctx.body = { error: 'AI experience failed' };
      }
    },
  })
);
