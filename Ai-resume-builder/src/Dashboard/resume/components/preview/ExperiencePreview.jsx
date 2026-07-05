

const ExperiencePreview = ({resumeInfo}) => {
  return (
    <div className="mt-6">
      <h2  style={{color: resumeInfo?.themeColor}} className="text-center font-bold text-xl">Professional Experience</h2>
      {resumeInfo?.experience.map((exp, index) => (
        <div key={index} className="py-2">
          <h3 style={{color: resumeInfo?.themeColor}} className="font-semibold">{exp.title}</h3>
          <p className="text-sm">{exp.companyName}</p>
          <div className="flex justify-between">
            <p>{exp.city}, {exp.state}</p>
          <p className="text-xs">{exp.startDate} - {exp.endDate}</p>
          </div>

          <p className="text-sm">{exp.workSummary}</p>
        </div>
      ))}
    </div>
  )
}

export default ExperiencePreview
