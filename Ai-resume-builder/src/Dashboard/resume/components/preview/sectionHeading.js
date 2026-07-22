/** Shared section-heading styles for classic / modern / ats templates */
export const sectionHeadingClass = (variant = "classic") => {
  if (variant === "ats") {
    return "font-bold text-base uppercase text-left text-black";
  }
  if (variant === "modern") {
    return "font-bold text-xl text-left";
  }
  return "font-bold text-xl text-center";
};

export const sectionHeadingStyle = (variant = "classic", themeColor) => {
  if (variant === "ats") {
    return { color: "#000000" };
  }
  return { color: themeColor || "#0f766e" };
};

export const subHeadingStyle = (variant = "classic", themeColor) => {
  if (variant === "ats") {
    return { color: "#000000" };
  }
  return { color: themeColor || "#0f766e" };
};
