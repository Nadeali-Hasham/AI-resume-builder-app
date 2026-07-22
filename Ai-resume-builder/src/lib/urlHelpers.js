/** Ensure href is absolute so the browser can open it */
export const toHref = (raw) => {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^mailto:/i.test(value) || /^tel:/i.test(value)) return value;
  return `https://${value}`;
};

/** Short label for display (domain or path) */
export const displayUrl = (raw) => {
  const value = String(raw || "").trim();
  if (!value) return "";
  try {
    const href = toHref(value);
    const u = new URL(href);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }
};
