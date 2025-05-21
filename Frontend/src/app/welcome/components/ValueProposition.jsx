export default function ValueProposition() {
  return (
    <section id="value" className="max-w-7xl mx-auto px-4 py-20 ">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#F6F6F6] mb-6">
          Revolutionizing Final Year Project Supervision
        </h1>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto">
          VISION provides a comprehensive cloud-based platform with offline
          capabilities, designed specifically for universities to enhance FYP
          management and supervision.
        </p>
      </div>

      <div className="grid md:grid-cols-2  gap-12 text-">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-blue-600 text-5xl mb-4">📈</div>
          <h3 className="text-2xl font-semibold mb-4">
            Real-Time Progress Tracking
          </h3>
          <p className="text-white">
            Monitor project milestones, task completion, and student progress
            through intuitive dashboards with automated reporting features.
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-blue-600 text-5xl mb-4">🔒</div>
          <h3 className="text-2xl font-semibold mb-4">Secure Collaboration</h3>
          <p className="text-white">
            Enterprise-grade security with AES-256 encryption and GDPR
            compliance, ensuring safe document sharing and communication.
          </p>
        </div>
      </div>
    </section>
  );
}
