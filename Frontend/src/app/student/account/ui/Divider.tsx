export default function Divider() {
  return (
    <div className="relative">
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </div>
  );
}
