import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, Save } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../Service/GlobalApi";
import { toast } from "sonner";

const emptyPersonal = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  address: "",
  phone: "",
  email: "",
};

const PersonalDetail = ({ enableNextButton, requireSaveForNext = true }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({
    ...emptyPersonal,
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: resumeInfo?.firstName || "",
      lastName: resumeInfo?.lastName || "",
      jobTitle: resumeInfo?.jobTitle || "",
      address: resumeInfo?.address || "",
      phone: resumeInfo?.phone || "",
      email: resumeInfo?.email || "",
    });
  }, [
    resumeInfo?.firstName,
    resumeInfo?.lastName,
    resumeInfo?.jobTitle,
    resumeInfo?.address,
    resumeInfo?.phone,
    resumeInfo?.email,
  ]);

  const handleInputChange = (e) => {
    if (requireSaveForNext) {
      enableNextButton(false);
    }
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResumeInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = (e) => {
    e.preventDefault();

    const payload = {
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      jobTitle: formData.jobTitle?.trim(),
      address: formData.address?.trim(),
      phone: formData.phone?.trim(),
      email: formData.email?.trim(),
    };

    if (!payload.firstName || !payload.lastName || !payload.jobTitle) {
      toast.error("Please fill first name, last name, and job title");
      return;
    }

    setLoading(true);
    GlobalApi.updateResumeDetail(params.resumeId, { data: payload })
      .then(() => {
        enableNextButton(true);
        setLoading(false);
        toast.success("Resume updated successfully");
      })
      .catch((error) => {
        console.error("Error updating resume:", error);
        setLoading(false);
        toast.error("Failed to update personal details");
      });
  };

  return (
    <div className="app-form-panel">
      <h2 className="app-form-title">Personal Information</h2>
      <p className="app-form-desc">Get started with basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <Input
              name="firstName"
              value={formData.firstName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <Input
              name="lastName"
              value={formData.lastName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="jobTitle" className="text-sm font-medium">
              Job Title
            </label>
            <Input
              name="jobTitle"
              value={formData.jobTitle}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              name="address"
              value={formData.address}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              name="phone"
              value={formData.phone}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <Button
              type="submit"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-white app-btn-accent shadow-md hover:shadow-lg transition-all duration-200 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
        </div>
      </form>
    </div>
  );
};

export default PersonalDetail;
