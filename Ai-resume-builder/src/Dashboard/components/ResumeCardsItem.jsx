// import { Notebook } from "lucide-react"
import { Link } from "react-router-dom"

const ResumeCardsItem = ({ resume }) => {
  const resumeData = resume?.attributes || resume;

  return (
    <div>
      <Link to={`/dashboard/resume/${resume.documentId || resumeData.documentId || resume.id}/edit`}>
        <div 
          className="p-14 bg-gradient-to-b from-gray-100 via-purple-200 to-gray-400 flex items-center justify-center h-[280px] rounded-lg border-t-4 hover:scale-105 transition-all hover:shadow-md shadow-primary"
          style={{
            borderColor: resumeData?.themeColor || "#14b8a6"
          }}
        >
          {/* <Notebook className="w-12 h-12 text-gray-600" /> */}
          <img src="/cv.png" width={80} height={80}/>
        </div>
        <h1 className="text-center my-1 font-medium text-gray-700 truncate">
          {resumeData?.title || "Untitled Resume"}
        </h1>
      </Link>
    </div>
  )
}

export default ResumeCardsItem