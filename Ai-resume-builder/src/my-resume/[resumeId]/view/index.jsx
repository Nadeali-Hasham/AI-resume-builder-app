import Header from "@/components/custom/header"
import { Button } from "@/components/ui/button"
import { ResumeInfoContext } from "@/context/ResumeInfoContext"
import ResumePreview from "@/Dashboard/resume/components/ResumePreview"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GlobalApi from "./../../../../Service/GlobalApi"
import { RWebShare } from "react-web-share"
import { Share2 } from "lucide-react"
import { emptyResumeInfo, mapResumeFromApi } from "@/lib/mapResumeFromApi"
import { toast, Toaster } from "sonner"

const ViewResume = () => {
    const [resumeInfo, setResumeInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const { resumeId } = useParams()

    const shareUrl =
        `${(import.meta.env.VITE_BASE_URL || window.location.origin).replace(/\/$/, "")}/my-resume/${resumeId}/view`

    const personName = [resumeInfo?.firstName, resumeInfo?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || "My"

    const shareTitle = `${personName} resume`

    useEffect(() => {
        if (!resumeId) return

        setLoading(true)
        GlobalApi.getResumeById(resumeId)
            .then((resp) => {
                setResumeInfo(mapResumeFromApi(resp?.data?.data))
            })
            .catch((error) => {
                console.error("Error loading resume:", error)
                setResumeInfo(emptyResumeInfo)
                toast.error("Failed to load resume")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [resumeId])

    const HandleDownloadResume = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading resume...
            </div>
        )
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <Toaster />
            <div id="no-print">
                <Header />
                <div className="p-10 mx-10 md:mx-20 lg:mx-36">
                    <h2 className="text-center text-2xl font-semibold text-slate-800">
                        Your resume is ready
                    </h2>
                    <p className="text-gray-500 text-center mt-2 max-w-xl mx-auto">
                        Download a polished PDF copy or share your professional profile with recruiters and your network.
                    </p>
                    <div className="flex justify-end gap-3 m-5">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex gap-2 bg-teal-500 text-white cursor-pointer"
                            onClick={HandleDownloadResume}
                        >
                            Download
                        </Button>
                        <RWebShare
                            data={{
                                text: "Hello everyone, please take a look at my professional resume.",
                                url: shareUrl,
                                title: shareTitle,
                            }}
                            sites={[
                                "facebook",
                                "twitter",
                                "whatsapp",
                                "reddit",
                                "telegram",
                                "linkedin",
                                "mail",
                                "copy",
                            ]}
                            disableNative={true}
                            closeText="Close"
                            onClick={() => toast.success("Shared successfully")}
                        >
                            <Button
                                type="button"
                                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
                            >
                                <Share2 className="w-4 h-4" />
                                Share Resume
                            </Button>
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div id="print-area" className="mx-10 md:mx-20 lg:mx-36">
                <ResumePreview />
            </div>
        </ResumeInfoContext.Provider>
    )
}

export default ViewResume
