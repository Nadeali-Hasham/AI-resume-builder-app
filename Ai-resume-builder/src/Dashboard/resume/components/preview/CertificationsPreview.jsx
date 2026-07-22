import { displayUrl, toHref } from "@/lib/urlHelpers";
import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";

const CertificationsPreview = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";
  const items = resumeInfo?.certifications || [];
  if (!items.length) return null;

  return (
    <div className="mt-5">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Certifications
      </h2>
      <ul className="mt-2 space-y-1.5">
        {items.map((c, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold">{c.name}</span>
            {c.issuer && <span className="text-slate-600"> — {c.issuer}</span>}
            {c.date && <span className="text-slate-500"> ({c.date})</span>}
            {c.credentialUrl?.trim() && (
              <>
                {" "}
                <a
                  href={toHref(c.credentialUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline-offset-2 hover:underline"
                  style={
                    variant === "ats" ? { color: "#000" } : { color: theme }
                  }
                >
                  {displayUrl(c.credentialUrl)}
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertificationsPreview;
