export default function HeaderData() {
  return (
    <header className="bg-[#4A154B] shadow-sm">
      {" "}
      {/* Slack Purple */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white">
            Supervisor Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-[#DDDDDD] rounded-md focus:ring-[#36C5F0] focus:border-[#36C5F0]"
                placeholder="Search students..."
              />
            </div>
            <button className="bg-[#2EB67D] text-white px-4 py-2 rounded-md hover:bg-[#33C373] transition-colors">
              Add Student
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
