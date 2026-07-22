import GlobalApi from './GlobalApi';

/**
 * AI helpers call Strapi so the Google key stays server-side.
 * Returns options array when the API provides multiple variants.
 */

export const generateSummaryFromAI = async ({
  jobTitle = '',
  jobDescription = '',
  currentSummary = '',
} = {}) => {
  const cleanJobTitle = String(jobTitle || '').trim();
  const cleanJd = String(jobDescription || '').trim();
  if (!cleanJobTitle && !cleanJd) {
    throw new Error('Job title or job description is required');
  }

  const response = await GlobalApi.generateSummaryFromAI({
    jobTitle: cleanJobTitle,
    jobDescription: cleanJd,
    currentSummary: String(currentSummary || '').trim(),
  });

  const options = Array.isArray(response?.data?.options)
    ? response.data.options.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const summary = (response?.data?.summary || options[0] || '').trim();
  if (!summary && !options.length) {
    throw new Error('No summary generated');
  }
  return { summary: summary || options[0], options: options.length ? options : [summary] };
};

export const generateExperienceBulletsFromAI = async ({
  title = '',
  jobDescription = '',
  currentHtml = '',
  companyName = '',
} = {}) => {
  const cleanTitle = String(title || '').trim();
  const cleanJd = String(jobDescription || '').trim();
  if (!cleanTitle && !cleanJd) {
    throw new Error('Position title or job description is required');
  }

  const response = await GlobalApi.generateExperienceFromAI({
    title: cleanTitle,
    jobDescription: cleanJd,
    currentHtml: String(currentHtml || '').trim(),
    companyName: String(companyName || '').trim(),
  });

  const strip = (html) =>
    String(html || '')
      .trim()
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

  const options = Array.isArray(response?.data?.options)
    ? response.data.options.map(strip).filter(Boolean)
    : [];
  const html = strip(response?.data?.html) || options[0] || '';
  if (!html) {
    throw new Error('No experience bullets generated');
  }
  return { html, options: options.length ? options : [html] };
};

export default {
  generateSummaryFromAI,
  generateExperienceBulletsFromAI,
};
