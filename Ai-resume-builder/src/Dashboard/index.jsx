import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "./../../Service/GlobalApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResumeCardsItem from "./components/ResumeCardsItem";
import { FileText, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
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
        const msg =
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Failed to load resumes";
        toast.error(msg);
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
    <div className="relative min-h-[calc(100vh-90px)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(13, 148, 136, 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(15, 23, 42, 0.06), transparent 50%), linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f1f5f9 100%)",
        }}
      />

      <div className="px-6 py-8 md:px-16 lg:px-28 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
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

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Your workspace
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, role, template…"
                className="h-10 w-full sm:w-64 pl-9 bg-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 cursor-pointer"
            >
              <option value="updated">Sort: Updated</option>
              <option value="created">Sort: Created</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AddResume />
          {filtered.length > 0 &&
            filtered.map((resume, index) => (
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
