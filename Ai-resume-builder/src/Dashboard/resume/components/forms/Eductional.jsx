import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, MinusIcon, PlusIcon, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { toast } from "sonner";
import EmptySectionHint from "../EmptySectionHint";

const formField = {
    universityName: "",
    degree: "",
    major: "",
    startDate: "",
    endDate: "",
    description: ""
};

function Education({ enableNextButton, requireSaveForNext = true }) {
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(false);

    // ====== LOAD EXISTING DATA ======
    useEffect(() => {
        if (resumeInfo?.education && resumeInfo.education.length > 0) {
            setEducationList(resumeInfo.education);
        } else {
            setEducationList([{ ...formField }]);
        }
    }, [resumeInfo?.education]);

    // ====== HANDLE INPUT CHANGE ======
    const handleChange = (e, index) => {
        if (requireSaveForNext) {
            enableNextButton?.(false);
        }
        const newEducationList = [...educationList];
        const { name, value } = e.target;
        newEducationList[index][name] = value;
        setEducationList(newEducationList);
        setResumeInfo({
            ...resumeInfo,
            education: newEducationList
        });
    };

    // ====== ADD EDUCATION ======
    const addEducation = () => {
        if (requireSaveForNext) {
            enableNextButton?.(false);
        }
        const newEducationList = [...educationList, { ...formField }];
        setEducationList(newEducationList);
        setResumeInfo({
            ...resumeInfo,
            education: newEducationList
        });
    };

    // ====== REMOVE SPECIFIC EDUCATION ======
    const removeEducation = (indexToRemove) => {
        if (educationList.length <= 1) return;
        if (requireSaveForNext) {
            enableNextButton?.(false);
        }
        const newEducationList = educationList.filter((_, index) => index !== indexToRemove);
        setEducationList(newEducationList);
        setResumeInfo({
            ...resumeInfo,
            education: newEducationList
        });
    };

    // ====== REMOVE LAST EDUCATION ======
    const removeLastEducation = () => {
        if (educationList.length <= 1) return;
        if (requireSaveForNext) {
            enableNextButton?.(false);
        }
        const newEducationList = educationList.slice(0, -1);
        setEducationList(newEducationList);
        setResumeInfo({
            ...resumeInfo,
            education: newEducationList
        });
    };

    // ====== SAVE EDUCATION ======
    const onSave = async (e) => {
        e.preventDefault();

        const validEducation = educationList.filter(
            (item) => item.universityName?.trim() || item.degree?.trim()
        );

        if (validEducation.length === 0) {
            toast.error("Please add at least one education entry");
            return;
        }

        setLoading(true);
        
        try {
            const data = {
                data: {
                    Education: validEducation.map(({ id, ...rest }) => ({
                        ...rest,
                        universityName: rest.universityName?.trim() || "",
                        degree: rest.degree?.trim() || "",
                        major: rest.major?.trim() || "",
                        description: rest.description?.trim() || "",
                    }))
                }
            };
            
            await GlobalApi.updateResumeDetail(params.resumeId, data);
            
            setEducationList(validEducation);
            setResumeInfo({
                ...resumeInfo,
                education: validEducation,
            });
            setLoading(false);
            enableNextButton(true);
            toast.success("Education updated successfully");
        } catch (error) {
            console.error("Error saving education:", error);
            setLoading(false);
            toast.error("Failed to save education");
        }
    };

    return (
        <div className="app-form-panel max-w-4xl mx-auto">
            <h2 className="app-form-title text-2xl">Education</h2>
            <p className="app-form-desc">Add your qualification details.</p>
            {!educationList.some((e) => e.universityName?.trim() || e.degree?.trim()) && (
                <EmptySectionHint
                    title="Tip: keep education scannable"
                    tip="Degree, major, school, and dates. Add a short line only if it strengthens the story."
                />
            )}

            <form onSubmit={onSave}>
                <div className="space-y-4">
                    {educationList.map((item, index) => (
                        <div 
                            key={index} 
                            className="border border-gray-200 p-5 rounded-xl bg-gray-50/50 hover:border-teal-200 transition-colors duration-200 mb-4"
                        >
                            {/* Header with Remove Button */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Education #{index + 1}
                                </h3>
                                {educationList.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                                        onClick={() => removeEducation(index)}
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">University Name</label>
                                    <Input 
                                        name="universityName"
                                        value={item.universityName || ""} 
                                        onChange={(e) => handleChange(e, index)} 
                                        placeholder="e.g. Stanford University"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Degree</label>
                                    <Input 
                                        name="degree"
                                        value={item.degree || ""} 
                                        onChange={(e) => handleChange(e, index)} 
                                        placeholder="e.g. Bachelor of Science"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Major</label>
                                    <Input 
                                        name="major"
                                        value={item.major || ""} 
                                        onChange={(e) => handleChange(e, index)} 
                                        placeholder="e.g. Computer Science"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                    <Input 
                                        type="date"
                                        name="startDate"
                                        value={item.startDate || ""} 
                                        onChange={(e) => handleChange(e, index)} 
                                        className="w-full"
                                    />
                                </div> 
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                    <Input 
                                        type="date"
                                        name="endDate"
                                        value={item.endDate || ""} 
                                        onChange={(e) => handleChange(e, index)} 
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <Textarea 
                                        name="description"
                                        value={item.description || ""} 
                                        onChange={(e) => handleChange(e, index)} 
                                        placeholder="Describe your education experience..."
                                        className="w-full min-h-[80px] resize-y"
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
                            onClick={removeLastEducation}
                            disabled={educationList.length === 1}
                        >
                            <MinusIcon className="w-4 h-4" />
                            Remove Education
                        </Button>
                        
                        <Button 
                            type="button"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                            onClick={addEducation}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Education
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

export default Education;