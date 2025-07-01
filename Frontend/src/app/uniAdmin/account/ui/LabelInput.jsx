"use client";

export default function LabelInput({
  id,
  label,
  type,
  value,
  onChange,
  disabled = false,
  icon,
  placeholder,
  children = null, // Default to null to make it optional
  ...rest
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label || children}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 
                     bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
                     rounded-xl text-white placeholder-slate-500
                     focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50
                     hover:border-slate-600/50 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-900/30`}
          {...rest}
        />
      </div>
    </div>
  );
}
