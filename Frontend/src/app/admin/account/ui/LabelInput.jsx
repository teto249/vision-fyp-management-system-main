export default function LabelInput({
  id,
  type = "text",
  value,
  onChange,
  disabled,
  children,
  placeholder,
  icon,
  required = false,
  ...rest
}) {
  return (
    <div className="space-y-2">
      <label 
        className="flex items-center gap-2 text-sm font-medium text-slate-300" 
        htmlFor={id}
      >
        {icon && <span className="text-slate-400">{icon}</span>}
        {children}
        {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="relative group">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-300 
            bg-white/5 backdrop-blur text-white placeholder-slate-400
            ${disabled 
              ? "border-slate-600 cursor-not-allowed opacity-60" 
              : "border-slate-500 hover:border-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
            }
            ${icon ? "pl-12" : ""}
          `}
          required={required}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        
        {!disabled && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
