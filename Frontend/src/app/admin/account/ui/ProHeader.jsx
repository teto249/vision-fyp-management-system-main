import { Edit3, X, Check, Loader2 } from "lucide-react";

export default function ProHeader({ toggleEditMode, isEditMode, saveStatus }) {
  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl border-b border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-blue-600/5" />
      
      <div className="relative grid grid-cols-3 items-center p-6">
        {/* Left side - Status indicator */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ${getSaveStatusColor()}`}>
              {getSaveStatusIcon()}
              <span className="text-sm font-medium">
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'success' && 'Saved'}
                {saveStatus === 'error' && 'Error'}
              </span>
            </div>
          )}
        </div>

        {/* Center - Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Account Details
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEditMode ? "Make changes to your profile" : "View your account information"}
          </p>
        </div>

        {/* Right side - Edit button */}
        <div className="flex justify-end">
          <button
            onClick={toggleEditMode}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
              ${
                isEditMode
                  ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50"
                  : "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
              }
            `}
          >
            {isEditMode ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}