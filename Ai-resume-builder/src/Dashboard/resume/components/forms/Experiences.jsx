import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MinusIcon, PlusIcon, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { toast } from "sonner";

const formField = {
    title: "",
    companyName: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    workSummary: ""
};

function Experiences({ enableNextButton }) {
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);

    // ====== LOAD EXISTING DATA ======
    useEffect(() => {
        if (resumeInfo?.experience && resumeInfo.experience.length > 0) {
            setExperiences(resumeInfo.experience);
        } else {
            setExperiences([{ ...formField }]);
        }
    }, [resumeInfo?.experience]);

    // ====== HANDLE INPUT CHANGE ======
    const handleInputChange = (e, index, field) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = e.target.value;
        setExperiences(newExperiences);
        // ✅ Update resumeInfo bhi karo
        setResumeInfo({
            ...resumeInfo,
            experience: newExperiences
        });
    };

    // ====== HANDLE RICH TEXT EDITOR CHANGE ======
    const handleRichTextEditor = (value, index, field) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        setExperiences(newExperiences);
        // ✅ Update resumeInfo bhi karo
        setResumeInfo({
            ...resumeInfo,
            experience: newExperiences
        });
    };

    // ====== ADD EXPERIENCE ======
    const addExperience = () => {
        const newExperiences = [...experiences, { ...formField }];
        setExperiences(newExperiences);
        // ✅ Update resumeInfo bhi karo
        setResumeInfo({
            ...resumeInfo,
            experience: newExperiences
        });
    };

    // ====== REMOVE SPECIFIC EXPERIENCE ======
    const removeExperience = (indexToRemove) => {
        if (experiences.length <= 1) return;
        const newExperiences = experiences.filter((_, index) => index !== indexToRemove);
        setExperiences(newExperiences);
        // ✅ Update resumeInfo bhi karo
        setResumeInfo({
            ...resumeInfo,
            experience: newExperiences
        });
    };

    // ====== REMOVE LAST EXPERIENCE ======
    const removeLastExperience = () => {
        if (experiences.length <= 1) return;
        const newExperiences = experiences.slice(0, -1);
        setExperiences(newExperiences);
        // ✅ Update resumeInfo bhi karo
        setResumeInfo({
            ...resumeInfo,
            experience: newExperiences
        });
    };

    // ====== SAVE EXPERIENCES ======
    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const data = {
                data: {
                    Experience: experiences.map(({ id, currentlyWorking, ...rest }) => rest)
                }
            };
            
            await GlobalApi.updateResumeDetail(params.resumeId, data);
            
            console.log("Experiences saved successfully");
            setLoading(false);
            enableNextButton(true);
            toast.success("Experiences updated successfully");
        } catch (error) {
            console.error("Error saving experiences:", error);
            setLoading(false);
            toast.error("Failed to save experiences");
        }
    };

    return (
        <div className="p-6 shadow-lg rounded-xl border-t-4 border-t-teal-500 bg-white max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Work Experience</h2>
            <p className="text-gray-500 mb-6">Provide details about your work experience</p>

            <form onSubmit={onSave}>
                <div className="space-y-4">
                    {experiences.map((item, index) => (
                        <div 
                            key={index} 
                            className="border border-gray-200 p-5 rounded-xl bg-gray-50/50 hover:border-teal-200 transition-colors duration-200"
                        >
                            {/* Header with Remove Button */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Experience #{index + 1}
                                </h3>
                                {experiences.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                                        onClick={() => removeExperience(index)}
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                            
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Position Title</label>
                                    <Input 
                                        value={item.title || ""} 
                                        onChange={(e) => handleInputChange(e, index, "title")} 
                                        placeholder="e.g. Senior Developer"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                                    <Input 
                                        value={item.companyName || ""} 
                                        onChange={(e) => handleInputChange(e, index, "companyName")} 
                                        placeholder="e.g. Google"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <Input 
                                        value={item.city || ""} 
                                        onChange={(e) => handleInputChange(e, index, "city")} 
                                        placeholder="e.g. San Francisco"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">State</label>
                                    <Input 
                                        value={item.state || ""} 
                                        onChange={(e) => handleInputChange(e, index, "state")} 
                                        placeholder="e.g. California"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                    <Input 
                                        type="date" 
                                        value={item.startDate || ""} 
                                        onChange={(e) => handleInputChange(e, index, "startDate")} 
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                    <Input 
                                        type="date" 
                                        value={item.endDate || ""} 
                                        onChange={(e) => handleInputChange(e, index, "endDate")} 
                                        className="w-full"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <RichTextEditor 
                                        index={index}
                                        value={item.workSummary || ""}
                                        onRichTextEditorChange={(value) => handleRichTextEditor(value, index, "workSummary")}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col gap-4 mt-8 pt-6 border-t-2 border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button 
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 border-2 border-red-200 bg-red-50/80 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all duration-200 rounded-xl shadow-sm hover:shadow"
                            onClick={removeLastExperience}
                            disabled={experiences.length === 1}
                        >
                            <MinusIcon className="w-4 h-4" />
                            Remove Experience
                        </Button>
                        
                        <Button 
                            type="button"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                            onClick={addExperience}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Experience
                        </Button>
                    </div>

                    <Button 
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Experiences;