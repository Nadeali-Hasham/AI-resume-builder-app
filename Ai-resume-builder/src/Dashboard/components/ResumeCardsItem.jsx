import { Notebook } from "lucide-react"
import { Link } from "react-router-dom"

const ResumeCardsItem = ({ resume }) => {
  return (
    <div>
    <Link to={`/dashboard/resume/${resume.resumeId}/edit`}>
        <div className="p-14 bg-secondary flex items-center justify-center h-72 border-primary rounded-lg">
            <Notebook />
        </div>
        <h1 className="text-center my-1">{resume.title}</h1>
     </Link>
     </div>
  )
}

export default ResumeCardsItem
