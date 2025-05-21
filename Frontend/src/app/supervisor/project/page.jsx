import TextDivider from "../components/ui/TextDivider";

const demoProjects = [
  {
    title: "AI-Based Student Performance Predictor",
    description:
      "Negative learning systems predict student academic outcomes using educational data ranging techniques",
    studentName: "All-Ian Ahmed",
    matricNo: "Nov. C521001",
    studentEmail: "all.almaa@university.edu",
  },
  {
    title: "Smart Campus Navigation App",
    description:
      "Mobile application with AC capabilities for indoor navigation in university buildings",
    studentName: "Sri Neuhafaza",
    matricNo: "Nov. IT20045",
    studentEmail: "sri.nuifasa@university.edu",
  },
  {
    title: "Blockchain-Based Certificate Verification",
    description:
      "Documentation system for automatically academic credentials using Etheorem smart contracts",
    studentName: "Rajesh Kumar",
    matricNo: "Nov. SE22033",
    studentEmail: "Rajesh.kumar@university.edu",
  },
];

export default function Projects({ projects = demoProjects }) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <TextDivider className="text-gray-200"> Projects</TextDivider>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {projects?.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">
            No projects found
          </p>
        ) : (
          projects?.map((project, index) => (
            <div
              key={index}
              className="group relative bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Student</span>
                    <span className="font-medium text-teal-600">
                      {project.studentName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Mark</span>
                    <span className="font-mono text-gray-300">
                      {project.matricNo}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Email</span>
                    <a
                      href={`mailto:${project.studentEmail}`}
                      className="text-teal-600 hover:text-teal-500 transition-colors"
                    >
                      {project.studentEmail}
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
