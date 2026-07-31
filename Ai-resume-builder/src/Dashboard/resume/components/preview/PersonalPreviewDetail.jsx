import { displayUrl, toHref } from "@/lib/urlHelpers";
import { getTemplate, isMonoTone } from "@/lib/resumeTemplates";

const ProfileLinks = ({
  resumeInfo,
  align = "center",
  theme,
  ats = false,
  stacked = false,
}) => {
  const items = [
    { key: "linkedin", label: "LinkedIn", value: resumeInfo?.linkedin },
    { key: "github", label: "GitHub", value: resumeInfo?.github },
    { key: "portfolio", label: "Portfolio", value: resumeInfo?.portfolio },
  ].filter((item) => String(item.value || "").trim());

  if (!items.length) return null;

  if (stacked) {
    return (
      <div className="mt-2 space-y-1.5 text-[10px] leading-snug">
        {items.map((item) => (
          <a
            key={item.key}
            href={toHref(item.value)}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all underline-offset-2 hover:underline"
            style={ats ? { color: "#000" } : { color: theme || "#0f766e" }}
            title={item.value}
          >
            <span className="font-semibold opacity-90">{item.label}</span>
            <span className="mt-0.5 block font-normal opacity-90">
              {displayUrl(item.value)}
            </span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      {items.map((item, index) => (
        <span key={item.key} className="inline-flex max-w-full items-center gap-3">
          {index > 0 && (
            <span className={ats ? "text-black" : "text-slate-300"} aria-hidden>
              ·
            </span>
          )}
          <a
            href={toHref(item.value)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 break-all underline-offset-2 hover:underline"
            style={ats ? { color: "#000" } : { color: theme || "#0f766e" }}
            title={item.value}
          >
            <span className="font-semibold">{item.label}:</span>{" "}
            <span className="font-normal opacity-90">{displayUrl(item.value)}</span>
          </a>
        </span>
      ))}
    </div>
  );
};

const LeftHeader = ({
  resumeInfo,
  theme,
  ats = false,
  size = "lg",
  stackedContact = false,
  light = false,
}) => {
  const nameClass =
    size === "sm"
      ? "text-xl font-bold break-words"
      : size === "xl"
        ? "text-3xl font-bold break-words"
        : "text-2xl font-bold break-words";
  const ink = light ? "#ffffff" : ats ? "#000" : theme;
  const muted = light ? "text-white/85" : ats ? "text-black" : "text-slate-600";
  const job = light ? "text-white/95" : ats ? "text-black text-sm" : "text-slate-800 text-base";

  return (
    <div className="resume-modern-header mb-4 min-w-0 max-w-full overflow-hidden">
      <h2 className={nameClass} style={{ color: ink }}>
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h3 className={`font-medium break-words ${job}`}>{resumeInfo?.jobTitle}</h3>
      {resumeInfo?.address ? (
        <p className={`mt-1 text-xs break-words ${muted}`}>{resumeInfo.address}</p>
      ) : null}

      {stackedContact ? (
        <div className={`mt-2 space-y-1 text-[11px] leading-snug ${muted}`}>
          {resumeInfo?.phone ? (
            <p className="break-all" style={light ? undefined : { color: ink }}>
              {resumeInfo.phone}
            </p>
          ) : null}
          {resumeInfo?.email ? (
            <p className="break-all" style={light ? undefined : { color: ink }}>
              {resumeInfo.email}
            </p>
          ) : null}
        </div>
      ) : (
        <p
          className="mt-1 text-xs break-all"
          style={ats || light ? { color: ink } : { color: theme }}
        >
          {[resumeInfo?.phone, resumeInfo?.email].filter(Boolean).join(" · ")}
        </p>
      )}

      <ProfileLinks
        resumeInfo={resumeInfo}
        align="left"
        theme={light ? "#ffffff" : theme}
        ats={ats}
        stacked={stackedContact}
      />
    </div>
  );
};

const PersonalPreviewDetail = ({ resumeInfo, variant = "classic" }) => {
  const theme = resumeInfo?.themeColor || "#0f766e";
  const meta = getTemplate(variant);

  if (meta.shell === "executive") {
    return (
      <div className="resume-executive-header min-w-0">
        <h2 className="break-words text-2xl font-bold text-white sm:text-3xl">
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        <h3 className="mt-1 break-words text-base font-medium text-white/95">
          {resumeInfo?.jobTitle}
        </h3>
        <p className="mt-2 break-words text-xs text-white/85">{resumeInfo?.address}</p>
        <div className="mt-1 space-y-0.5 text-xs text-white/90">
          {resumeInfo?.phone ? <p className="break-all">{resumeInfo.phone}</p> : null}
          {resumeInfo?.email ? <p className="break-all">{resumeInfo.email}</p> : null}
        </div>
        <div className="mt-2 [&_a]:text-white [&_span]:text-white/70">
          <ProfileLinks resumeInfo={resumeInfo} align="left" theme="#ffffff" stacked />
        </div>
      </div>
    );
  }

  if (isMonoTone(variant)) {
    return (
      <div className="mb-3 min-w-0">
        <h2 className="break-words text-xl font-bold text-black">
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        <p className="break-words text-sm text-black">{resumeInfo?.jobTitle}</p>
        <div className="mt-1 space-y-0.5 text-xs text-black">
          {resumeInfo?.address ? <p className="break-words">{resumeInfo.address}</p> : null}
          {resumeInfo?.phone ? <p className="break-all">{resumeInfo.phone}</p> : null}
          {resumeInfo?.email ? <p className="break-all">{resumeInfo.email}</p> : null}
        </div>
        <ProfileLinks resumeInfo={resumeInfo} align="left" ats stacked />
      </div>
    );
  }

  if (meta.shell === "sidebar") {
    return (
      <LeftHeader
        resumeInfo={resumeInfo}
        theme={theme}
        size="lg"
        stackedContact
        light
      />
    );
  }

  if (meta.shell === "rail") {
    return <LeftHeader resumeInfo={resumeInfo} theme={theme} size="lg" />;
  }

  if (meta.shell === "elegant") {
    return (
      <div className="mb-5 min-w-0">
        <LeftHeader resumeInfo={resumeInfo} theme={theme} size="xl" />
        <div
          className="mt-2 h-px w-24"
          style={{ backgroundColor: theme }}
          aria-hidden
        />
      </div>
    );
  }

  if (meta.shell === "compact") {
    return <LeftHeader resumeInfo={resumeInfo} theme={theme} size="sm" stackedContact />;
  }

  if (meta.shell === "minimal") {
    return (
      <div className="mb-6 min-w-0">
        <LeftHeader resumeInfo={resumeInfo} theme={theme} size="xl" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <h2 style={{ color: theme }} className="break-words text-center text-2xl font-bold">
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h2 className="break-words text-center text-xl text-slate-800">
        {resumeInfo?.jobTitle}
      </h2>
      <h2 className="break-words text-center text-sm font-normal text-slate-600">
        {resumeInfo?.address}
      </h2>
      <div className="mt-1 flex flex-col items-center gap-0.5 text-sm" style={{ color: theme }}>
        {resumeInfo?.phone ? <span className="break-all text-center">{resumeInfo.phone}</span> : null}
        {resumeInfo?.email ? <span className="break-all text-center">{resumeInfo.email}</span> : null}
      </div>
      <ProfileLinks resumeInfo={resumeInfo} align="center" theme={theme} />
      <hr className="my-1 border border-t-2" style={{ borderColor: theme }} />
    </div>
  );
};

export default PersonalPreviewDetail;
