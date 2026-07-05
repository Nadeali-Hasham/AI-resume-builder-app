
const SkillPreview = ({ resumeInfo }) => {
  return (
    <div>
      <h2 className="font-bold text-xl text-center" style={{color: resumeInfo?.themeColor}}>Skills</h2>
      <div className="grid grid-cols-2 gap-x-5 mt-4">
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index} className="flex justify-between py-1">
            <h2>{skill.name}</h2>
            <div className="h-2 bg-gray-100 w-[120px]">
                <div className="h-2" style={{ backgroundColor: resumeInfo?.themeColor, width: `${skill.rating * 20}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillPreview
