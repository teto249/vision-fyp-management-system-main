"use client";

export default function UsersPage() {
  const universities = [
    {
      id: "1",
      name: "University A",
      allowedCapacity: { students: 100, supervisors: 10 },
      students: [
        { id: "s1", name: "John Doe", email: "john.doe@universitya.edu" },
        { id: "s2", name: "Jane Smith", email: "jane.smith@universitya.edu" },
      ],
      supervisors: [
        { id: "sup1", name: "Dr. Alice", email: "alice@universitya.edu" },
        { id: "sup2", name: "Dr. Bob", email: "bob@universitya.edu" },
      ],
    },
    {
      id: "2",
      name: "University B",
      allowedCapacity: { students: 50, supervisors: 5 },
      students: [
        { id: "s3", name: "Michael Brown", email: "michael.brown@universityb.edu" },
      ],
      supervisors: [
        { id: "sup3", name: "Dr. Charlie", email: "charlie@universityb.edu" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Users by Universities
        </h1>

        {universities.map((university) => (
          <div
            key={university.id}
            className="bg-gray-800 rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-teal-400 mb-4">
              {university.name}
            </h2>
            <p className="text-gray-300 mb-4">
              Allowed Capacity: {university.allowedCapacity.students} Students,{" "}
              {university.allowedCapacity.supervisors} Supervisors
            </p>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                Students ({university.students.length})
              </h3>
              <ul className="space-y-2">
                {university.students.map((student) => (
                  <li
                    key={student.id}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                  >
                    <span className="text-gray-200">{student.name}</span>
                    <a
                      href={`mailto:${student.email}`}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      {student.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Supervisors ({university.supervisors.length})
              </h3>
              <ul className="space-y-2">
                {university.supervisors.map((supervisor) => (
                  <li
                    key={supervisor.id}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                  >
                    <span className="text-gray-200">{supervisor.name}</span>
                    <a
                      href={`mailto:${supervisor.email}`}
                      className="text-teal-400 hover:text-teal-300"
                    >
                      {supervisor.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}