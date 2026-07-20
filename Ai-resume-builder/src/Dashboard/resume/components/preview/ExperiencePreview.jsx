import { sanitizeHtml } from '@/lib/sanitizeHtml';

const ExperiencePreview = ({ resumeInfo }) => {
    if (!resumeInfo?.experience || resumeInfo.experience.length === 0) {
        return (
            <div className="mt-5">
                <h2 style={{ color: resumeInfo?.themeColor }} className="text-center font-bold text-xl">
                    Professional Experience
                </h2>
                <p className="text-center text-gray-400 text-sm mt-2">No experience added yet</p>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <h2 style={{ color: resumeInfo?.themeColor }} className="text-center font-bold text-xl">
                Professional Experience
            </h2>
            {resumeInfo.experience.map((exp, index) => (
                <div key={index} className="py-2">
                    <h3 style={{ color: resumeInfo?.themeColor }} className="font-semibold">
                        {exp.title || "Untitled"}
                    </h3>
                    <p className="text-sm font-medium">{exp.companyName || "Company Name"}</p>
                    <div className="flex justify-between text-sm">
                        <p>{exp.city || ""}, {exp.state || ""}</p>
                        <p className="text-xs">{exp.startDate || ""} To {exp.endDate || ""}</p>
                    </div>

                    {exp.workSummary ? (
                        <div
                            className="resume-html-content text-sm mt-1"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.workSummary) }}
                        />
                    ) : (
                        <p className="text-sm text-gray-400 mt-1">No summary provided</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ExperiencePreview;
