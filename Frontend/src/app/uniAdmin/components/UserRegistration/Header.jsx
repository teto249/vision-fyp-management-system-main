import { UserPlus } from "lucide-react";

export default function Header() {
  return (
    <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border-b border-slate-700/50 p-8">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]" />
      </div>
      
      <div className="relative text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-2">
          User Registration Portal
        </h2>
        <p className="text-slate-400 text-lg">
          Add new members to your university community
        </p>
      </div>
    </div>
  );
}