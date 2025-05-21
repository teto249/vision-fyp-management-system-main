export const studentList = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@university.edu",
    course: "Computer Science",
    progress: 68,
    assignments: [
      { id: 1, title: "Project Proposal", status: "completed", score: 92 },
      { id: 2, title: "Mid-term Report", status: "completed", score: 78 },
      {
        id: 3,
        title: "Final Presentation",
        status: "in-progress",
        score: null,
      },
    ],
    attendance: 85,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie.s@university.edu",
    course: "Data Science",
    progress: 45,
    assignments: [
      { id: 1, title: "Data Analysis", status: "completed", score: 88 },
      {
        id: 2,
        title: "Visualization Project",
        status: "overdue",
        score: null,
      },
      { id: 3, title: "Final Report", status: "not-started", score: null },
    ],
    attendance: 62,
    lastActive: "3 days ago",
  },
  {
    id: 3,
    name: "Taylor Wilson",
    email: "taylor.w@university.edu",
    course: "Computer Science",
    progress: 92,
    assignments: [
      { id: 1, title: "Project Proposal", status: "completed", score: 95 },
      { id: 2, title: "Mid-term Report", status: "completed", score: 91 },
      { id: 3, title: "Final Presentation", status: "completed", score: 89 },
    ],
    attendance: 98,
    lastActive: "5 hours ago",
  },
];