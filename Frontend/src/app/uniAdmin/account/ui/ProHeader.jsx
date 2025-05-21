export default function ProHeader({ toggleEditMode, isEditMode }) {
  return (
    <div className="grid grid-cols-3 items-center bg-base-300/10 p-4">
      {/* <!-- Empty left column --> */}
      <div></div>

      {/* <!-- Center column for text --> */}
      <div className="text-center">
        <h5 className="text-xl font-bold">Account Details</h5>
      </div>

      {/* <!-- Right column for button --> */}
      <div className="flex justify-end">
        <button
          onClick={toggleEditMode}
          className={isEditMode ? "btn-secondary" : "btn-primary"}
        >
          {isEditMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}
