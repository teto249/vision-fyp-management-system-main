export default function TextDivider({ children, icon }) {
  return (
    <div className="relative flex items-center py-4">
      <div className="flex-grow border-t border-slate-600"></div>
      <div className="mx-4 flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-600">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-lg font-semibold text-white whitespace-nowrap">
          {children}
        </span>
      </div>
      <div className="flex-grow border-t border-slate-600"></div>
    </div>
  );
}
