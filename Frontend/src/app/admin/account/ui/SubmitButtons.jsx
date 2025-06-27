import { Save, X, Loader2, Check } from "lucide-react";

export default function SubmitButtons({ toggleEditMode, isSubmitting, saveStatus }) {
  return (
    <div className="flex justify-center gap-4 pt-6 border-t border-slate-600">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
          ${isSubmitting 
            ? "bg-slate-600 text-slate-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
          }
        `}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : saveStatus === 'success' ? (
          <>
            <Check className="w-4 h-4" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
      
      <button
        type="button"
        onClick={toggleEditMode}
        disabled={isSubmitting}
        className={`
          flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
          ${isSubmitting 
            ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
            : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:border-slate-500"
          }
        `}
      >
        <X className="w-4 h-4" />
        Cancel
      </button>
    </div>
  );
}