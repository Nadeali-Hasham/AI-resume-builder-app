import { Notebook } from "lucide-react"
import { Link } from "react-router-dom"

const ResumeCardsItem = ({ resume }) => {
  const resumeData = resume?.attributes || resume;

  return (
    <div>
    <Link to={`/dashboard/resume/${resumeData.documentId}/edit`}>
        <div className="bg-gray-50 border p-14 bg-secondary flex items-center justify-center h-72 border-primary rounded-lg hover:scale-105 transition-all duration-200 hover:shadow-md shadow-primary">
            <Notebook />
        </div>
        <h1 className="text-center my-1">{resumeData.title}</h1>
     </Link>
     </div>
  )
}

export default ResumeCardsItem
