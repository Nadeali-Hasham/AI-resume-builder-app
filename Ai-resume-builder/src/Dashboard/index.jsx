import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi, { setApiUserEmail } from "./../../Service/GlobalApi";
import { useCallback, useEffect, useState } from "react";
import ResumeCardsItem from "./components/ResumeCardsItem";
import { FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetResumesList = useCallback(() => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) return;

    setApiUserEmail(userEmail);
    setLoading(true);
    GlobalApi.getUserResumes()
      .then((response) => {
        setResumeList(response?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching user resumes:", error);
        toast.error("Failed to load resumes");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      GetResumesList();
    }
  }, [isLoaded, user, GetResumesList]);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="relative min-h-[calc(100vh-90px)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(13, 148, 136, 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(15, 23, 42, 0.06), transparent 50%), linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f1f5f9 100%)",
        }}
      />

      <div className="px-6 py-8 md:px-16 lg:px-28 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p
              className="text-sm font-medium tracking-wide text-teal-700 mb-2"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Welcome back, {firstName}
            </p>
            <h1
              className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight"
              style={{ fontFamily: '"Fraunces", serif' }}
            >
              My Resumes
            </h1>
            <p
              className="mt-3 max-w-xl text-slate-600 text-[15px] leading-relaxed"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Build polished, AI-assisted resumes and keep every version ready
              for your next opportunity.
            </p>
          </div>

          <div
            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Total resumes
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {loading ? "—" : resumeList.length}
              </p>
            </div>
            <div className="ml-2 hidden sm:flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white">
              <Sparkles className="h-3 w-3 text-teal-300" />
              AI Ready
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Your workspace
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AddResume />
          {resumeList.length > 0 &&
            resumeList.map((resume, index) => (
              <ResumeCardsItem
                resume={resume}
                key={resume.documentId || resume.id || index}
                refreshData={GetResumesList}
              />
            ))}
        </div>

        {!loading && resumeList.length === 0 && (
          <p
            className="mt-8 text-center text-sm text-slate-500"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            No resumes yet — create your first one to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
