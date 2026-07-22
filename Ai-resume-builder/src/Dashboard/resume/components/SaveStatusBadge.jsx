import { Check, LoaderCircle, AlertCircle } from "lucide-react";

const SaveStatusBadge = ({ status = "idle" }) => {
  if (status === "idle") {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
        Ready
      </span>
    );
  }

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800">
        <LoaderCircle className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-medium text-teal-800">
        <Check className="h-3 w-3" />
        Saved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
      <AlertCircle className="h-3 w-3" />
      Save failed
    </span>
  );
};

export default SaveStatusBadge;
