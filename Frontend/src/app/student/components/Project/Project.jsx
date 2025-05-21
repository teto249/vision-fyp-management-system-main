export default function Project({ projectData }) {
  const totalTasks = projectData.milestones.reduce(
    (sum, milestone) => sum + milestone.tasks.length,
    0
  );
  const completedTasks = projectData.milestones.reduce(
    (sum, milestone) =>
      sum + milestone.tasks.filter((task) => task.status === "Completed").length,
    0
  );

  return (
    <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">{projectData.title}</h2>
      <p className="text-gray-300 mb-4">{projectData.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
        <p>
          <span className="font-medium text-white">Start Date:</span>{" "}
          {projectData.startDate}
        </p>
        <p>
          <span className="font-medium text-white">End Date:</span>{" "}
          {projectData.endDate}
        </p>
        <p>
          <span className="font-medium text-white">Supervisor:</span>{" "}
          {projectData.supervisor}
        </p>
      </div>
      <div>
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
      </div>
    </section>
  );
}
