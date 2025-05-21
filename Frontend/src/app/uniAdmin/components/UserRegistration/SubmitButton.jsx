export default function SubmitButton({ showBulkUpload, bulkUploadData, role }) {
  return (
    <div className="pt-4">
      <button
        type="submit"
        className="w-full py-3 bg-teal-400 hover:bg-teal-500 text-gray-900 font-semibold rounded-lg transition-colors"
      >
        {showBulkUpload
          ? `Register ${bulkUploadData.length} Users`
          : `Register ${role}`}
      </button>
    </div>
  );
}