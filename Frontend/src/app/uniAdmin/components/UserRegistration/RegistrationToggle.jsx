export default function RegistrationToggle({ showBulkUpload, setShowBulkUpload }) {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        className={`px-4 py-2 rounded-full transition-colors ${
          !showBulkUpload
            ? "bg-teal-400 text-gray-900 font-semibold"
            : "bg-gray-700 text-gray-300"
        }`}
        onClick={() => setShowBulkUpload(false)}
      >
        Single Registration
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded-full transition-colors ${
          showBulkUpload
            ? "bg-teal-400 text-gray-900 font-semibold"
            : "bg-gray-700 text-gray-300"
        }`}
        onClick={() => setShowBulkUpload(true)}
      >
        Bulk Registration
      </button>
    </div>
  );
}