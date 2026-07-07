import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { toast } from "sonner";

const PersonalDetail = ({enableNextButton}) => {
    const params = useParams();
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Current resume ID:", params);
    }, []);

    const handleInputChange = (e) => {
        enableNextButton(false);
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setResumeInfo((prev) => ({ ...prev, [name]: value }));
    };

    const onSave = (e) => {
        e.preventDefault(); 
        setLoading(true); // ✅ Set loading ko function call karo
        const data = {
            data: formData
        };
        GlobalApi.updateResumeDetail(params.resumeId, data, resumeInfo)
            .then(() => {
                console.log("Resume updated successfully");
                enableNextButton(true);
                setLoading(false);
                toast.success("Resume updated successfully");
            })
            .catch((error) => {
                console.error("Error updating resume:", error);
                setLoading(false);
            });
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-teal-500">
            <h2 className="text-lg font-bold mb-2">Personal Information</h2>
            <p>Get started with basic information</p>

            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                        <Input name="firstName" defaultValue={resumeInfo.firstName} required onChange={handleInputChange}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                        <Input name="lastName" defaultValue={resumeInfo.lastName} required onChange={handleInputChange}/>
                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
                        <Input name="jobTitle" defaultValue={resumeInfo.jobTitle} required onChange={handleInputChange}/>
                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <Input name="address" defaultValue={resumeInfo.address} required onChange={handleInputChange}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                        <Input name="phone" defaultValue={resumeInfo.phone} required onChange={handleInputChange}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input name="email" defaultValue={resumeInfo.email} required onChange={handleInputChange}/>
                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                        <Button 
                            type="submit"
                            className="mt-4 text-white bg-teal-500 cursor-pointer hover:bg-teal-600"
                            disabled={loading}
                        >
                            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PersonalDetail;