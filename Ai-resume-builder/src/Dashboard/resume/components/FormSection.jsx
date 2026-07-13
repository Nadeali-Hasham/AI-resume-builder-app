import { Button } from "@/components/ui/button"
import PersonalDetail from "./forms/PersonalDetail"
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react"
import {  useState } from "react";
import Summary from "./forms/Summary";
import Experiences from "./forms/Experiences";
import Eductional from "./forms/Eductional";

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNextButton, setEnableNextButton] = useState(false);
  return (
   <div>
    <div className="flex justify-between items-center mb-4">
      <Button 
        size="sm" 
        variant="primary" 
        className="flex gap-2 bg-teal-500 text-white cursor-pointer" 
        onClick={() => {}}>
       <LayoutGrid />
        <span>Theme</span>
      </Button>
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
   </div>
  )
}

export default FormSection
