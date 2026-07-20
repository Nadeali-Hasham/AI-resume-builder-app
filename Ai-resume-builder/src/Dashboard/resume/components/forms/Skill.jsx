import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    LoaderCircle,
    MinusIcon,
    PlusIcon,
    Save
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../Service/GlobalApi";

const emptySkill = {
    name: "",
    rating: 1
};

const Skill = ({ enableNextButton, requireSaveForNext = true }) => {
    const params = useParams();

    const {
        resumeInfo,
        setResumeInfo
    } = useContext(ResumeInfoContext);

    const [skillsList, setSkillsList] = useState([
        { ...emptySkill }
    ]);

    const [loading, setLoading] = useState(false);

    // Load already saved skills
    useEffect(() => {
        if (
            resumeInfo?.skills &&
            Array.isArray(resumeInfo.skills) &&
            resumeInfo.skills.length > 0
        ) {
            setSkillsList(resumeInfo.skills);
        } else {
            setSkillsList([{ ...emptySkill }]);
        }
    }, [resumeInfo?.skills]);

    // Update skill name or rating
    const handleChange = (index, field, value) => {
        if (requireSaveForNext) {
            enableNextButton?.(false);
        }

        const updatedSkills = skillsList.map((skill, skillIndex) => {
            if (skillIndex === index) {
                return {
                    ...skill,
                    [field]: value
                };
            }

            return skill;
        });

        setSkillsList(updatedSkills);

        setResumeInfo({
            ...resumeInfo,
            skills: updatedSkills
        });
    };

    // Add new skill
    const addSkill = () => {
        const updatedSkills = [
            ...skillsList,
            { ...emptySkill }
        ];

        setSkillsList(updatedSkills);

        setResumeInfo({
            ...resumeInfo,
            skills: updatedSkills
        });
    };

    // Remove selected skill
    const removeSkill = (indexToRemove) => {
        if (skillsList.length <= 1) {
            return;
        }

        const updatedSkills = skillsList.filter(
            (_, index) => index !== indexToRemove
        );

        setSkillsList(updatedSkills);

        setResumeInfo({
            ...resumeInfo,
            skills: updatedSkills
        });
    };

    // Remove last skill
    const removeLastSkill = () => {
        if (skillsList.length <= 1) {
            return;
        }

        const updatedSkills = skillsList.slice(0, -1);

        setSkillsList(updatedSkills);

        setResumeInfo({
            ...resumeInfo,
            skills: updatedSkills
        });
    };

    // Save skills in database
    const onSave = async (event) => {
        event.preventDefault();

        const validSkills = skillsList.filter(
            (skill) => skill.name.trim() !== ""
        );

        if (validSkills.length === 0) {
            toast.error("Please add at least one skill");
            return;
        }

        setLoading(true);

        try {
            const data = {
                data: {
                    skills: validSkills.map(
                        ({ id, ...skill }) => skill
                    )
                }
            };

            await GlobalApi.updateResumeDetail(
                params.resumeId,
                data
            );

            setSkillsList(validSkills);

            setResumeInfo({
                ...resumeInfo,
                skills: validSkills
            });

            enableNextButton?.(true);

            toast.success("Skills updated successfully");
        } catch (error) {
            console.error("Error saving skills:", error);

            toast.error("Failed to save skills");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-form-panel max-w-4xl mx-auto">
            <h2 className="app-form-title text-2xl">
                Skills
            </h2>

            <p className="app-form-desc">
                Add your professional skills and proficiency level.
            </p>

            <form onSubmit={onSave}>
                <div className="space-y-4">
                    {skillsList.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 p-5 rounded-xl bg-gray-50/50 hover:border-teal-200 transition-colors duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Skill #{index + 1}
                                </h3>

                                {skillsList.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                                        onClick={() => removeSkill(index)}
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                        Skill Name
                                    </label>

                                    <Input
                                        value={item.name || ""}
                                        onChange={(event) =>
                                            handleChange(
                                                index,
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. React.js"
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                        Proficiency
                                    </label>

                                    <div className="min-h-10 flex items-center">
                                        <Rating
                                            style={{ maxWidth: 140 }}
                                            value={Math.max(1, item.rating || 1)}
                                            onChange={(value) =>
                                                handleChange(
                                                    index,
                                                    "rating",
                                                    Math.max(1, value)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 mt-8 pt-6 border-t-2 border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 border-2 border-red-200 bg-red-50/80 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all duration-200 rounded-xl shadow-sm hover:shadow"
                            onClick={removeLastSkill}
                            disabled={skillsList.length === 1}
                        >
                            <MinusIcon className="w-4 h-4" />
                            Remove Skill
                        </Button>

                        <Button
                            type="button"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                            onClick={addSkill}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Skill
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
};

export default Skill;