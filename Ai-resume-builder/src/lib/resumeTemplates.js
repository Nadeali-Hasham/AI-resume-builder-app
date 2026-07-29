/**
 * Resume layout templates — each id has a distinct visual vocabulary.
 */
export const RESUME_TEMPLATES = [
  {
    id: "classic",
    label: "Classic",
    desc: "Centered serif, color top bar",
    shell: "bar",
    align: "center",
    tone: "theme",
    skills: "bars",
    languages: "chips",
    heading: "classic",
  },
  {
    id: "modern",
    label: "Modern",
    desc: "Bold titles + accent rail + skill bars",
    shell: "rail",
    align: "left",
    tone: "theme",
    skills: "bars",
    languages: "chips",
    heading: "modern",
  },
  {
    id: "ats",
    label: "ATS",
    desc: "Plain Arial, no bars, machine-friendly",
    shell: "plain",
    align: "left",
    tone: "mono",
    skills: "list",
    languages: "inline",
    heading: "ats",
  },
  {
    id: "elegant",
    label: "Elegant",
    desc: "Serif italic headings, hairline rules",
    shell: "elegant",
    align: "left",
    tone: "theme",
    skills: "dots",
    languages: "inline",
    heading: "elegant",
  },
  {
    id: "compact",
    label: "Compact",
    desc: "Dense uppercase labels, pill skills",
    shell: "compact",
    align: "left",
    tone: "theme",
    skills: "pills",
    languages: "pills",
    heading: "compact",
  },
  {
    id: "executive",
    label: "Executive",
    desc: "Color banner header, ruled sections",
    shell: "executive",
    align: "left",
    tone: "theme",
    skills: "bars",
    languages: "chips",
    heading: "executive",
  },
  {
    id: "minimal",
    label: "Minimal",
    desc: "Airy space, muted caps, plain lists",
    shell: "minimal",
    align: "left",
    tone: "theme",
    skills: "list",
    languages: "inline",
    heading: "minimal",
  },
  {
    id: "sidebar",
    label: "Sidebar",
    desc: "Solid color column + white body",
    shell: "sidebar",
    align: "left",
    tone: "theme",
    skills: "bars",
    languages: "chips",
    heading: "sidebar",
  },
];

export const getTemplate = (id) =>
  RESUME_TEMPLATES.find((t) => t.id === id) || RESUME_TEMPLATES[0];

export const isMonoTone = (id) => getTemplate(id).tone === "mono";

export const isCenterAlign = (id) => getTemplate(id).align === "center";

export const usesSkillBars = (id) => getTemplate(id).skills === "bars";

export const getSkillMode = (id) => getTemplate(id).skills || "bars";

export const getLanguageMode = (id) => getTemplate(id).languages || "chips";
