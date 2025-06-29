import { GraduationCap, UserCheck } from "lucide-react";

export default function RoleSelector({ role, handleRoleChange }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Select User Role</h3>
        <p className="text-slate-400">Choose the type of user you want to register</p>
      </div>
      
      <div className="flex justify-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 inline-flex">
          <button
            type="button"
            className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              role === "Student"
                ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
            onClick={() => handleRoleChange("Student")}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Student</span>
          </button>
          <button
            type="button"
            className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              role === "Supervisor"
                ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
            onClick={() => handleRoleChange("Supervisor")}
          >
            <UserCheck className="w-5 h-5" />
            <span className="font-medium">Supervisor</span>
          </button>
        </div>
      </div>
    </div>
  );
}