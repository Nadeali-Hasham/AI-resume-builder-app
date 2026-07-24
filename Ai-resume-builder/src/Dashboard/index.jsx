import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "./../../Service/GlobalApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResumeCardsItem from "./components/ResumeCardsItem";
import { FileText, Search, Sparkles } from "lucide-react";
import { Input } from "../components/ui/input";
import { AI_RESUME_LIMIT, apiErrorMessage, isAiEnabledResume } from "../lib/planLimits";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { PAGE_SEO } from "@/lib/seo";

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

  const aiCount = useMemo(
    () => resumeList.filter((r) => isAiEnabledResume(r)).length,
    [resumeList]
  );
  const aiAtLimit = aiCount >= AI_RESUME_LIMIT;

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
      <Seo {...PAGE_SEO.dashboard} />
      <div className="app-dashboard-bg pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-10 lg:px-16 xl:px-28 md:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="min-w-0">
            <p
              className="mb-2 text-sm font-medium tracking-wide text-teal-700 dark:text-teal-300"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Welcome back, {firstName}
            </p>
            <h1
              className="text-2xl font-semibold tracking-tight text-[var(--app-ink)] sm:text-3xl md:text-4xl"
              style={{ fontFamily: '"Fraunces", serif' }}
            >
              My Resumes
            </h1>
            <p
              className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--app-muted)] sm:mt-3 sm:text-[15px]"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Build polished resumes anytime. Manual is unlimited; AI-assisted
              slots: {AI_RESUME_LIMIT} per account.
            </p>
          </div>

          <div
            className="flex w-full items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/80 px-3 py-3 shadow-sm backdrop-blur-sm sm:w-auto sm:px-4"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--app-muted)]">
                Total resumes
              </p>
              <p className="text-lg font-semibold text-[var(--app-ink)]">
                {loading ? "—" : resumeList.length}
              </p>
              <p className="text-[11px] text-[var(--app-muted)]">Manual unlimited</p>
            </div>
            <div className="ml-2 flex flex-col items-start gap-1 sm:items-end">
              <div className="flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white dark:bg-slate-100 dark:text-slate-900">
                <Sparkles className="h-3 w-3 text-teal-300 dark:text-teal-700" />
                AI {loading ? "—" : `${aiCount}/${AI_RESUME_LIMIT}`}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Your workspace
          </h2>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, role, template…"
                className="h-10 w-full border-[var(--app-border)] bg-[var(--app-surface)] pl-9 text-[var(--app-ink)]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm text-[var(--app-ink)] sm:w-auto"
            >
              <option value="updated">Sort: Updated</option>
              <option value="created">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
          <AddResume aiCount={aiCount} aiAtLimit={aiAtLimit} />
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="min-h-[220px] animate-pulse rounded-2xl border border-[var(--app-border)] bg-[var(--app-soft)] sm:min-h-[280px]"
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

        {!loading && aiAtLimit && (
          <p className="mt-4 text-center text-xs text-[var(--app-muted)]">
            AI slots full ({AI_RESUME_LIMIT}/{AI_RESUME_LIMIT}). You can still
            create unlimited manual resumes.
          </p>
        )}

        {!loading && resumeList.length === 0 && (
          <p
            className="mt-8 text-center text-sm text-[var(--app-muted)]"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            No resumes yet — create your first one to get started.
          </p>
        )}

        {!loading && resumeList.length > 0 && filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-[var(--app-muted)]">
            No resumes match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
