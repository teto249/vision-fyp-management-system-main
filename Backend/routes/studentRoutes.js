const express = require("express");
const router = express.Router();

const {
  getStudentAccount,
  updateStudentAccount,
  getSupervisorsByUniversity,
  createProject,
  getProject,
  getProjectById,
  addMilestone,
  addTask,
  addMeeting,
  updateProjectMilestones,
  // getSupervisorDocuments,
  // getDocumentById,
  // downloadDocument,
  listDocuments,
  getDocumentContent,
} = require("../controllers/studentController");

// Student routes
router.get("/account", getStudentAccount);
router.put("/account", updateStudentAccount);
router.get("/:universityId", getSupervisorsByUniversity);
router.post("/projects", createProject);
router.get("/project", getProject);
router.get("/project/:studentId", getProjectById);
router.post("/project/:projectId/milestones", addMilestone);
router.put("/project/:projectId/milestones", updateProjectMilestones);
router.post("/milestones/:milestoneId/tasks", addTask);
router.post("/milestones/:milestoneId/meetings", addMeeting);

// Document routes
router.get("/documents/supervisor/:supervisorId", listDocuments); // Changed from /documents/:supervisorId/list
router.get("/documents/:id", getDocumentContent); // Changed from /documents/:id/content

module.exports = router;
