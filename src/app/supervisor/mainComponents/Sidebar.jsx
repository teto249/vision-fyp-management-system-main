export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Floating Sidebar */}
      <aside
        className={`fixed top-[60px] left-0 h-[90vh] w-[90vw] max-w-xs bg-teal-900 shadow-2xl transition-all duration-300 ease-in-out z-40 rounded-r-xl mx-6 my-2
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:w-64`}
      >
        <div className="p-4  h-full overflow-y-auto">
          <ul className="menu space-y-2 bg-transparent ">
            {[
              { icon: "home", text: "Home" },
              { icon: "user", text: "Account" },
              { icon: "message", text: "Notifications" },
              { icon: "building", text: "List of Universities" },
              { icon: "calendar", text: "Calendar" },
              { icon: "shopping-bag", text: "Register University" },
            ].map((item) => (
              <li key={item.text}>
                <a
                  href="#"
                  className="flex items-center bg-teal-800 gap-3 py-3 px-4 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <span
                    className={`icon-[tabler--${item.icon}] size-5 text-teal-400`}
                  ></span>
                  <span className="text-sm font-medium">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
