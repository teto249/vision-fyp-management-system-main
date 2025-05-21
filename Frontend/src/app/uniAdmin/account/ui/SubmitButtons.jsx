export default function SubmitButtons({toggleEditMode ,disabled}) {
  return (
    <div className="justify-center flex gap-4 mt-6">
      <button
        type="submit"
        variant="primary"
        className=" border hover:bg-green-900 border-gray-500 rounded-md px-4 py-2"
      >
        Save Changes
      </button>
      <button
        type="button"
        variant="secondary"
        className=" border hover:bg-red-900 border-gray-500 rounded-md px-4 py-2"
        onClick={toggleEditMode}
        disabled= {disabled}
      >
        Cancel
      </button>
    </div>
  );
}
