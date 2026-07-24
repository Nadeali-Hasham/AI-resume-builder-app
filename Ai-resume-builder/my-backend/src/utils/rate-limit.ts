/**
 * Simple in-memory sliding-window rate limiter (per key).
 * Suitable for single-instance / develop; swap for Redis in multi-instance prod.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export const checkRateLimit = (
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSec: number } => {
  const now = Date.now();
  const bucket = buckets.get(key) || { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterSec: Math.max(retryAfterSec, 1) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterSec: 0,
  };
};

export const getAiDailyLimit = () =>
  Math.max(1, parseInt(process.env.AI_DAILY_LIMIT || '20', 10) || 20);

/** Max resumes that may use AI features (manual resumes are unlimited). */
export const getAiResumeLimit = () =>
  Math.max(
    1,
    parseInt(process.env.AI_RESUME_LIMIT || process.env.FREE_RESUME_LIMIT || '5', 10) || 5
  );

/** @deprecated use getAiResumeLimit — kept for older imports */
export const getFreeResumeLimit = getAiResumeLimit;
