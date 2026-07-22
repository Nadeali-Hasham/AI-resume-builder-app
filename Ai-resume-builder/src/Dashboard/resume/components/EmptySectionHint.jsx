const EmptySectionHint = ({ title, tip }) => (
  <div className="mb-4 rounded-xl border border-dashed border-teal-200/80 bg-teal-50/40 px-4 py-3">
    <p
      className="text-sm font-semibold text-slate-800"
      style={{ fontFamily: '"Fraunces", serif' }}
    >
      {title}
    </p>
    <p className="mt-1 text-xs leading-relaxed text-slate-600">{tip}</p>
  </div>
);

export default EmptySectionHint;
