/**
 * Verifies Clerk session JWT via JWKS (from publishable key) and/or secret key.
 * Sets ctx.state.authUserId + authEmail.
 */

import type { Core } from '@strapi/strapi';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const PUBLIC_PATH_PREFIXES = [
  '/api/user-resumes/public/',
  '/admin',
  '/uploads',
  '/_health',
];

const isPublicPath = (path: string) =>
  PUBLIC_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

/** pk_test_BASE64 → Frontend API host (e.g. foo.clerk.accounts.dev) */
const frontendApiFromPublishableKey = (publishableKey: string): string | null => {
  try {
    const raw = publishableKey.replace(/^pk_(test|live)_/, '').trim();
    if (!raw) return null;
    const decoded = Buffer.from(raw, 'base64').toString('utf8').replace(/\$$/, '').trim();
    return decoded || null;
  } catch {
    return null;
  }
};

const emailFromPayload = (payload: Record<string, unknown>): string | null => {
  const direct =
    payload.email ||
    payload.primary_email ||
    payload.email_address ||
    (payload as any)?.email_addresses?.[0]?.email_address;
  if (typeof direct === 'string' && direct.trim()) {
    return direct.trim().toLowerCase();
  }
  return null;
};

export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  const secretKey = (process.env.CLERK_SECRET_KEY || '').trim();
  const publishableKey = (process.env.CLERK_PUBLISHABLE_KEY || '').trim();

  let clerkClient: ReturnType<typeof createClerkClient> | null = null;
  if (secretKey && secretKey.startsWith('sk_')) {
    clerkClient = createClerkClient({ secretKey });
    strapi.log.info('[clerk-auth] Secret key mode enabled');
  } else if (secretKey.startsWith('pk_')) {
    strapi.log.error(
      '[clerk-auth] CLERK_SECRET_KEY is a publishable key (pk_...). Leave it empty or use sk_....'
    );
  }

  const fapiHost = publishableKey ? frontendApiFromPublishableKey(publishableKey) : null;
  let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
  if (fapiHost) {
    jwks = createRemoteJWKSet(
      new URL(`https://${fapiHost}/.well-known/jwks.json`)
    );
    strapi.log.info(`[clerk-auth] JWKS ready via ${fapiHost}`);
  } else {
    strapi.log.error(
      '[clerk-auth] CLERK_PUBLISHABLE_KEY missing/invalid — cannot verify session tokens'
    );
  }

  return async (ctx: any, next: () => Promise<void>) => {
    const path = ctx.request.path || '';

    if (isPublicPath(path) || ctx.method === 'OPTIONS') {
      return next();
    }

    const isResumeApi =
      path.startsWith('/api/user-resumes') || path.startsWith('/api/ai');
    if (!isResumeApi) {
      return next();
    }

    const authHeader =
      ctx.request.header.authorization ||
      ctx.request.header.Authorization ||
      '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : '';

    ctx.state.authUserId = null;
    ctx.state.authEmail = null;

    if (!token) {
      return next();
    }

    try {
      let payload: Record<string, unknown> | null = null;

      // 1) Prefer JWKS verify (works with publishable key only)
      if (jwks) {
        const verified = await jwtVerify(token, jwks);
        payload = verified.payload as Record<string, unknown>;
      } else if (secretKey && secretKey.startsWith('sk_')) {
        payload = (await verifyToken(token, { secretKey })) as unknown as Record<
          string,
          unknown
        >;
      }

      if (!payload?.sub) {
        return next();
      }

      ctx.state.authUserId = String(payload.sub);

      let email = emailFromPayload(payload);

      // Optional: enrich email via Backend API when secret is configured
      if (!email && clerkClient) {
        try {
          const user = await clerkClient.users.getUser(String(payload.sub));
          const primary =
            user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId) ||
            user.emailAddresses[0];
          email = (primary?.emailAddress || '').trim().toLowerCase() || null;
        } catch (err: any) {
          strapi.log.debug(`[clerk-auth] getUser failed: ${err?.message || err}`);
        }
      }

      // Fallback: client-provided email header (only after JWT verified)
      if (!email) {
        const headerEmail = ctx.request.header['x-user-email'];
        if (typeof headerEmail === 'string' && headerEmail.trim()) {
          email = headerEmail.trim().toLowerCase();
        }
      }

      ctx.state.authEmail = email;
    } catch (err: any) {
      strapi.log.warn(`[clerk-auth] verify failed: ${err?.message || err}`);
      ctx.state.authUserId = null;
      ctx.state.authEmail = null;
    }

    return next();
  };
};
