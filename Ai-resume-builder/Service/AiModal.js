import GlobalApi from './GlobalApi';

/**
 * AI helpers now call the Strapi backend so the Google key stays server-side.
 * A fresh request is made each time (no shared chat history).
 */

export const generateSummaryFromAI = async (jobTitle) => {
  const cleanJobTitle = String(jobTitle || '').trim();
  if (!cleanJobTitle) {
    throw new Error('Job title is required');
  }

  const response = await GlobalApi.generateSummaryFromAI(cleanJobTitle);
  const summary = response?.data?.summary?.trim();
  if (!summary) {
    throw new Error('No summary generated');
  }
  return summary;
};

export const generateExperienceBulletsFromAI = async (title) => {
  const cleanTitle = String(title || '').trim();
  if (!cleanTitle) {
    throw new Error('Position title is required');
  }

  const response = await GlobalApi.generateExperienceFromAI(cleanTitle);
  let html = response?.data?.html?.trim() || '';

  // Strip markdown fences if model wraps HTML
  html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  if (!html) {
    throw new Error('No experience bullets generated');
  }
  return html;
};

export default {
  generateSummaryFromAI,
  generateExperienceBulletsFromAI,
};
