import { User, Users } from "lucide-react";

export default function RegistrationToggle({ showBulkUpload, setShowBulkUpload }) {
  return (
    <div className="flex justify-center">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 inline-flex">
        <button
          type="button"
          className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            !showBulkUpload
              ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
          onClick={() => setShowBulkUpload(false)}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Single Registration</span>
        </button>
        <button
          type="button"
          className={`group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            showBulkUpload
              ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/25"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          }`}
          onClick={() => setShowBulkUpload(true)}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Bulk Registration</span>
        </button>
      </div>
    </div>
  );
}