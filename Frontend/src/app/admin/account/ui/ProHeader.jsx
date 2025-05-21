export default function ProHeader({ toggleEditMode, isEditMode }) {
  return (
    <div className="grid grid-cols-3 items-center bg-gray-800 p-4 border-b border-gray-600">
      <div></div>
      <div className="text-center">
        <h5 className="text-xl font-bold text-gray-200">Account Details</h5>
      </div>
      <div className="flex justify-end">
        <button
          onClick={toggleEditMode}
          className={`px-4 py-2 rounded-md font-medium ${
            isEditMode
              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
              : "bg-teal-500 text-gray-900 hover:bg-primary-400"
          } transition-colors`}
        >
          {isEditMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}