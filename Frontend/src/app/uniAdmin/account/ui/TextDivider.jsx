"use client";

export default function TextDivider({ children, text, icon }) {
  return (
    <div className="relative flex items-center">
      <div className="flex-grow border-t border-slate-700/50"></div>
      <div className="flex items-center space-x-2 px-4 bg-slate-800/50 rounded-full border border-slate-700/50">
        {icon && <div className="text-teal-400">{icon}</div>}
        <span className="text-sm font-medium text-slate-300 whitespace-nowrap">
          {text || children}
        </span>
      </div>
      <div className="flex-grow border-t border-slate-700/50"></div>
    </div>
  );
}
