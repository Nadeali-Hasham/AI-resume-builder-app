import { toHref } from "@/lib/urlHelpers";
import {
  sectionHeadingClass,
  sectionHeadingStyle,
} from "./sectionHeading";

const formatCertDate = (value) => {
  if (!value) return "";
  const raw = String(value).slice(0, 10);
  const d = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CertificationsPreview = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";
  const items = resumeInfo?.certifications || [];
  if (!items.length) return null;

  const linkStyle =
    variant === "ats" ? { color: "#000" } : { color: theme };

  return (
    <div className="mt-5 text-left">
      <h2
        className={sectionHeadingClass(variant)}
        style={sectionHeadingStyle(variant, theme)}
      >
        Certifications
      </h2>
      <ul className="mt-2 space-y-4">
        {items.map((c, i) => (
          <li
            key={i}
            className="flex flex-col items-start gap-2 text-sm text-left break-inside-avoid"
          >
            <div className="w-full min-w-0">
              <p className="m-0">
                <span className="font-semibold">{c.name}</span>
                {c.issuer && (
                  <span className="text-slate-600"> — {c.issuer}</span>
                )}
                {c.date && (
                  <span className="text-slate-500">
                    {" "}
                    ({formatCertDate(c.date)})
                  </span>
                )}
              </p>
              <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                {c.credentialUrl?.trim() && (
                  <a
                    href={toHref(c.credentialUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                    style={linkStyle}
                  >
                    Credential
                  </a>
                )}
                {c.imageUrl?.trim() && (
                  <a
                    href={c.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                    style={linkStyle}
                  >
                    View certificate
                  </a>
                )}
              </div>
            </div>
            {c.imageUrl &&
              String(c.imageUrl).match(/\.(png|jpe?g|gif|webp)(\?|$)/i) && (
                <img
                  src={c.imageUrl}
                  alt=""
                  className="h-24 w-24 rounded-md border border-slate-200 object-contain bg-slate-50"
                />
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertificationsPreview;
