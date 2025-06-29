import { Loader2, Save, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SubmitButton({ showBulkUpload, bulkUploadData, role, isSubmitting }) {
  const getButtonText = () => {
    if (isSubmitting) {
      return showBulkUpload ? "Registering Users..." : "Registering User...";
    }
    return showBulkUpload
      ? `Register ${bulkUploadData.length} Users`
      : `Register ${role}`;
  };

  const getButtonIcon = () => {
    if (isSubmitting) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }
    return <Save className="w-5 h-5" />;
  };

  const isDisabled = isSubmitting || (showBulkUpload && bulkUploadData.length === 0);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/50">
      <button
        type="submit"
        disabled={isDisabled}
        className={`group flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-medium
                   transition-all duration-300 shadow-lg flex-1 sm:flex-none
                   ${isDisabled 
                     ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed' 
                     : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-teal-500/25 hover:scale-105 transform'
                   }`}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </button>

      {showBulkUpload && bulkUploadData.length === 0 && (
        <div className="flex items-center space-x-2 text-amber-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Please upload a file before registering</span>
        </div>
      )}
    </div>
  );
}