import { displayUrl, toHref } from "@/lib/urlHelpers";

const ProfileLinks = ({ resumeInfo, align = "center", theme, ats = false }) => {
  const items = [
    { key: "linkedin", label: "LinkedIn", value: resumeInfo?.linkedin },
    { key: "github", label: "GitHub", value: resumeInfo?.github },
    { key: "portfolio", label: "Portfolio", value: resumeInfo?.portfolio },
  ].filter((item) => String(item.value || "").trim());

  if (!items.length) return null;

  return (
    <div
      className={`mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      {items.map((item, index) => (
        <span key={item.key} className="inline-flex items-center gap-3">
          {index > 0 && (
            <span className={ats ? "text-black" : "text-slate-300"} aria-hidden>
              ·
            </span>
          )}
          <a
            href={toHref(item.value)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline break-all"
            style={ats ? { color: "#000" } : { color: theme || "#0f766e" }}
            title={item.value}
          >
            <span className="font-semibold">{item.label}:</span>{" "}
            <span className={ats ? "font-normal" : "font-normal opacity-90"}>
              {displayUrl(item.value)}
            </span>
          </a>
        </span>
      ))}
    </div>
  );
};

const PersonalPreviewDetail = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";

  if (variant === "modern") {
    return (
      <div className="resume-modern-header mb-4">
        <h2 className="text-2xl font-bold" style={{ color: theme }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        <h3 className="text-base font-medium text-slate-800">{resumeInfo?.jobTitle}</h3>
        <p className="mt-1 text-xs text-slate-600">{resumeInfo?.address}</p>
        <p className="text-xs" style={{ color: theme }}>
          {[resumeInfo?.phone, resumeInfo?.email].filter(Boolean).join(" · ")}
        </p>
        <ProfileLinks resumeInfo={resumeInfo} align="left" theme={theme} />
      </div>
    );
  }

  if (variant === "ats") {
    return (
      <div className="mb-3">
        <h2 className="text-xl font-bold text-black">
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        <p className="text-sm text-black">{resumeInfo?.jobTitle}</p>
        <p className="text-xs text-black">
          {[resumeInfo?.address, resumeInfo?.phone, resumeInfo?.email]
            .filter(Boolean)
            .join(" | ")}
        </p>
        <ProfileLinks resumeInfo={resumeInfo} align="left" ats />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: theme }} className="font-bold text-center text-2xl">
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h2 className="text-center text-xl">{resumeInfo?.jobTitle}</h2>
      <h2 className="text-center text-sm font-normal">{resumeInfo?.address}</h2>
      <div className="flex justify-between" style={{ color: theme }}>
        <h2 className="text-center text-sm font-normal">{resumeInfo?.phone}</h2>
        <h2 className="text-center text-sm font-normal">{resumeInfo?.email}</h2>
      </div>
      <ProfileLinks resumeInfo={resumeInfo} align="center" theme={theme} />
      <hr className="border-t-2 border my-1" style={{ borderColor: theme }} />
    </div>
  );
};

export default PersonalPreviewDetail;
