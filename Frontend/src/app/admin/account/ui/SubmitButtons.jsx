export default function SubmitButtons({ toggleEditMode }) {
  return (
    <div className="justify-center flex gap-4 mt-6">
      <button
        type="submit"
        className="bg-primary-500 hover:text-black text-gray-200 hover:bg-teal-400 border border-primary-600 rounded-md px-4 py-2 font-medium transition-colors"
      >
        Save Changes
      </button>
      <button
        type="button"
        className="bg-gray-600 text-gray-200 hover:bg-gray-500 border border-gray-500 rounded-md px-4 py-2 font-medium transition-colors"
        onClick={toggleEditMode}
      >
        Cancel
      </button>
    </div>
  );
}