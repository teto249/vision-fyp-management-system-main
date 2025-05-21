export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 ">
        <h2 className="text-3xl font-bold text-center text-[#F6F6F6] mb-12">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Offline Access",
              desc: "Work without internet with automatic sync when connection resumes",
              icon: "🌐",
            },
            {
              title: "Smart Notifications",
              desc: "Automated reminders for deadlines and meetings",
              icon: "🔔",
            },
            {
              title: "Document Management",
              desc: "Version control and organization for all project files",
              icon: "📂",
            },
            {
              title: "Role-Based Access",
              desc: "Custom permissions for students, supervisors, and admins",
              icon: "👥",
            },
            {
              title: "Meeting Scheduler",
              desc: "Integrated calendar with virtual meeting support",
              icon: "📅",
            },
            {
              title: "Analytics Dashboard",
              desc: "Real-time insights into project progress and engagement",
              icon: "📊",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800  p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-100">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
