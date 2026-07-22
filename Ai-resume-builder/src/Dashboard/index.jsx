import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "./../../Service/GlobalApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResumeCardsItem from "./components/ResumeCardsItem";
import { FileText, Search, Sparkles } from "lucide-react";
import { Input } from "../components/ui/input";
import { FREE_RESUME_LIMIT, apiErrorMessage } from "../lib/planLimits";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  const GetResumesList = useCallback(() => {
    if (!user) return;

    setLoading(true);
    GlobalApi.getUserResumes()
      .then((response) => {
        setResumeList(response?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching user resumes:", error);
        toast.error(apiErrorMessage(error, "Failed to load resumes"));
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...resumeList];
    if (q) {
      list = list.filter((r) => {
        const d = r?.attributes || r;
        return (
          (d.title || "").toLowerCase().includes(q) ||
          (d.jobTitle || "").toLowerCase().includes(q) ||
          (d.template || "").toLowerCase().includes(q)
        );
      });
    }
    list.sort((a, b) => {
      const da = a?.attributes || a;
      const db = b?.attributes || b;
      if (sortBy === "title") {
        return String(da.title || "").localeCompare(String(db.title || ""));
      }
      if (sortBy === "created") {
        return new Date(db.createdAt || 0) - new Date(da.createdAt || 0);
      }
      return new Date(db.updatedAt || 0) - new Date(da.updatedAt || 0);
    });
    return list;
  }, [resumeList, query, sortBy]);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="relative min-h-[calc(100vh-90px)] overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(13, 148, 136, 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(15, 23, 42, 0.06), transparent 50%), linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f1f5f9 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-10 lg:px-16 xl:px-28 md:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="min-w-0">
            <p
              className="mb-2 text-sm font-medium tracking-wide text-teal-700"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Welcome back, {firstName}
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
              style={{ fontFamily: '"Fraunces", serif' }}
            >
              My Resumes
            </h1>
            <p
              className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-[15px]"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Build polished, AI-assisted resumes (free plan: up to{" "}
              {FREE_RESUME_LIMIT}). Keep every version ready for your next
              opportunity.
            </p>
          </div>

          <div
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3 shadow-sm backdrop-blur-sm sm:w-auto sm:px-4"
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
                {loading ? "—" : `${resumeList.length} / ${FREE_RESUME_LIMIT}`}
              </p>
              <p className="text-[11px] text-slate-400">Free plan limit</p>
            </div>
            <div className="ml-2 hidden sm:flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white">
              <Sparkles className="h-3 w-3 text-teal-300" />
              AI Ready
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Your workspace
          </h2>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, role, template…"
                className="h-10 w-full bg-white pl-9"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 sm:w-auto"
            >
              <option value="updated">Sort: Updated</option>
              <option value="created">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
          <AddResume
            disabled={!loading && resumeList.length >= FREE_RESUME_LIMIT}
            atLimit={!loading && resumeList.length >= FREE_RESUME_LIMIT}
          />
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="min-h-[220px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100/80 sm:min-h-[280px]"
              />
            ))}
          {!loading &&
            filtered.length > 0 &&
            filtered.map((resume, index) => (
              <ResumeCardsItem
                resume={resume}
                key={resume.documentId || resume.id || index}
                refreshData={GetResumesList}
              />
            ))}
        </div>

        {!loading && resumeList.length >= FREE_RESUME_LIMIT && (
          <p className="mt-4 text-center text-xs text-slate-500">
            Free plan: up to {FREE_RESUME_LIMIT} resumes. Delete one to create another.
          </p>
        )}

        {!loading && resumeList.length === 0 && (
          <p
            className="mt-8 text-center text-sm text-slate-500"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            No resumes yet — create your first one to get started.
          </p>
        )}

        {!loading && resumeList.length > 0 && filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No resumes match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
