import { Button } from "@/components/ui/button"
import PersonalDetail from "./forms/PersonalDetail"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import {  useState } from "react";
import Summary from "./forms/Summary";
import Experiences from "./forms/Experiences";
import Eductional from "./forms/Eductional";
import Skill from "./forms/Skill";
import { Link, Navigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNextButton, setEnableNextButton] = useState(false);
  const {resumeId} = useParams();
  return (
   <div>
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-3">
        <div>
          <Link to={"/dashboard"}>
            <Button 
            size="sm" 
            variant="primary" 
            className="flex gap-2 bg-teal-500 text-white cursor-pointer" 
            onClick={() => {}}>
              <Home />
            </Button>
          </Link>
        </div>
       <ThemeColor/>
      </div>
      <div className="flex gap-2 justify-between">
        {activeFormIndex > 1 &&   
          <Button 
            size="sm" 
            variant="secondary" 
            className="flex gap-2 bg-teal-500 text-white cursor-pointer" 
            onClick={() => setActiveFormIndex(activeFormIndex - 1)}>
         <ArrowLeft /> 
          <span>Previous</span>
        </Button>}
        
        <Button 
          size="sm" 
          variant="secondary" 
          disabled={!enableNextButton}
          className="flex gap-2 bg-teal-500 text-white cursor-pointer" 
          onClick={() => setActiveFormIndex(activeFormIndex + 1)}>
          <ArrowRight /> 
          <span>Next</span>
        </Button>
      </div>
    </div>

    {/* Personal Information Form */}
    {activeFormIndex === 1? <PersonalDetail enableNextButton = {(v) => setEnableNextButton(v)} /> :null}

    {/* Summary Form */}
    {activeFormIndex === 2? <Summary enableNextButton = {(v) => setEnableNextButton(v)}/> :null}

    {/* Work Experience Form */}
    {activeFormIndex === 3? <Experiences enableNextButton = {(v) => setEnableNextButton(v)} /> :null}

    {/* Education Information Form */}
    {activeFormIndex === 4? <Eductional enableNextButton = {(v) => setEnableNextButton(v)} /> :null}

    {/* Skills Form */}
    {activeFormIndex === 5? <Skill enableNextButton = {(v) => setEnableNextButton(v)} /> :null}

    {/* view resume */}
    {activeFormIndex === 6? <Navigate to={`/my-resume/${resumeId}/view`} enableNextButton = {(v) => setEnableNextButton(v)} /> :null}

   </div>
  )
}

export default FormSection
