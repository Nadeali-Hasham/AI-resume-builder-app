import Header from "@/components/custom/header"
import { Button } from "@/components/ui/button"
import { ResumeInfoContext } from "@/context/ResumeInfoContext"
import ResumePreview from "@/Dashboard/resume/components/ResumePreview"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import GlobalApi from "./../../../../Service/GlobalApi"
import { RWebShare } from "react-web-share"
import { Download, LoaderCircle, Share2 } from "lucide-react"
import { emptyResumeInfo, mapResumeFromApi } from "@/lib/mapResumeFromApi"
import { downloadResumePdf } from "@/lib/downloadResumePdf"
import { toast, Toaster } from "sonner"
import "./view-resume.css"

const ViewResume = () => {
    const [resumeInfo, setResumeInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
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
        GlobalApi.getPublicResumeById(resumeId)
            .then((resp) => {
                setResumeInfo(mapResumeFromApi(resp?.data?.data))
            })
            .catch((error) => {
                console.error("Error loading resume:", error)
                setResumeInfo(emptyResumeInfo)
                toast.error("Couldn’t load resume")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [resumeId])

    const HandleDownloadResume = async () => {
        setDownloading(true)
        try {
            await downloadResumePdf({
                fileName: `${personName.replace(/\s+/g, "-")}-resume.pdf`,
            })
            toast.success("PDF ready")
        } catch (error) {
            console.error(error)
            toast.error("PDF failed — using print")
            window.print()
        } finally {
            setDownloading(false)
        }
    }

    useEffect(() => {
        if (loading || !shouldAutoDownload || !resumeInfo) return

        const timer = setTimeout(() => {
            HandleDownloadResume()
        }, 600)

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, shouldAutoDownload, resumeInfo])

    if (loading) {
        return (
            <div className="view-resume-page flex flex-col items-center justify-center gap-4 p-10">
                <div className="view-resume-skeleton" />
                <p className="app-subtitle text-sm">Loading resume…</p>
            </div>
        )
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <Toaster position="bottom-right" richColors closeButton />
            <div className="view-resume-page">
                <div id="no-print">
                    <Header />
                    <div className="view-resume-hero">
                        <div className="view-resume-actions">
                            <div className="view-resume-actions__text">
                                <p className="view-resume-kicker">Ready to send</p>
                                <h2 className="app-title text-xl sm:text-2xl md:text-3xl">
                                    {personName}&apos;s resume
                                </h2>
                                <p className="app-subtitle mt-1 text-xs sm:text-sm md:text-base">
                                    Download a polished PDF or share a private link.
                                </p>
                            </div>
                            <div className="view-resume-actions__buttons">
                                <Button
                                    size="sm"
                                    className="flex gap-2 app-btn-accent cursor-pointer"
                                    onClick={HandleDownloadResume}
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <LoaderCircle className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    {downloading ? "Preparing PDF…" : "Download PDF"}
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
                                    onClick={() => toast.success("Shared")}
                                >
                                    <Button
                                        type="button"
                                        className="flex items-center gap-2 app-btn-dark cursor-pointer"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </Button>
                                </RWebShare>
                            </div>
                        </div>
                    </div>
                </div>

                {downloading && (
                    <div id="no-print" className="view-pdf-banner">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Building your PDF…
                    </div>
                )}

                <div id="print-area" className="view-resume-print">
                    <div className="view-resume-sheet">
                        <ResumePreview />
                    </div>
                </div>

                <div id="no-print" className="view-resume-mobile-bar">
                    <Button
                        size="sm"
                        className="flex-1 app-btn-accent cursor-pointer"
                        onClick={HandleDownloadResume}
                        disabled={downloading}
                    >
                        {downloading ? "Preparing…" : "Download PDF"}
                    </Button>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    )
}

export default ViewResume
