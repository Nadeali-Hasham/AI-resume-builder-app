import Header from "@/components/custom/header"
import { Button } from "@/components/ui/button"
import { ResumeInfoContext } from "@/context/ResumeInfoContext"
import ResumePreview from "@/Dashboard/resume/components/ResumePreview"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import GlobalApi from "./../../../../Service/GlobalApi"
import { RWebShare } from "react-web-share"
import { Download, Share2 } from "lucide-react"
import { emptyResumeInfo, mapResumeFromApi } from "@/lib/mapResumeFromApi"
import { toast, Toaster } from "sonner"
import "./view-resume.css"

const ViewResume = () => {
    const [resumeInfo, setResumeInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const { resumeId } = useParams()
    const [searchParams] = useSearchParams()
    const shouldAutoDownload = searchParams.get("download") === "true"

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

    useEffect(() => {
        if (loading || !shouldAutoDownload || !resumeInfo) return

        const timer = setTimeout(() => {
            window.print()
        }, 400)

        return () => clearTimeout(timer)
    }, [loading, shouldAutoDownload, resumeInfo])

    const HandleDownloadResume = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="view-resume-page flex items-center justify-center p-10 app-subtitle">
                Loading resume...
            </div>
        )
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <Toaster />
            <div className="view-resume-page">
                <div id="no-print">
                    <Header />
                    <div className="view-resume-actions">
                        <div className="view-resume-actions__text">
                            <h2 className="app-title text-2xl md:text-3xl">
                                Your resume is ready
                            </h2>
                            <p className="app-subtitle mt-1 text-sm md:text-base">
                                Download a polished PDF or share it with recruiters.
                            </p>
                        </div>
                        <div className="view-resume-actions__buttons">
                            <Button
                                size="sm"
                                className="flex gap-2 app-btn-accent cursor-pointer"
                                onClick={HandleDownloadResume}
                            >
                                <Download className="w-4 h-4" />
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
                                    className="flex items-center gap-2 app-btn-dark cursor-pointer"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share Resume
                                </Button>
                            </RWebShare>
                        </div>
                    </div>
                </div>

                <div id="print-area" className="view-resume-print">
                    <div className="view-resume-sheet">
                        <ResumePreview />
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    )
}

export default ViewResume
