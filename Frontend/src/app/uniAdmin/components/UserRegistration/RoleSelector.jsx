export default function RoleSelector({ role, handleRoleChange }) {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-teal-400 pl-4 bg-gray-700 rounded-tr-3xl rounded-br-3xl py-3">
        <h3 className="text-xl font-semibold text-gray-100">User Role</h3>
        <p className="text-sm text-gray-400 mt-1">Select the type of user to register</p>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-full transition-colors ${
            role === "Student"
              ? "bg-teal-400 text-gray-900 font-semibold"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => handleRoleChange("Student")}
        >
          Student
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-full transition-colors ${
            role === "Supervisor"
              ? "bg-teal-400 text-gray-900 font-semibold"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => handleRoleChange("Supervisor")}
        >
          Supervisor
        </button>
      </div>
    </div>
  );
}