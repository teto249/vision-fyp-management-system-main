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
  updateMilestone,
  deleteMilestone,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  updateProjectMilestones,
  listDocuments,
  getDocumentContent,
  getDocumentPDF,
} = require("../controllers/studentController");

// Student routes
router.get("/account", getStudentAccount);
router.put("/account", updateStudentAccount);
router.get("/:universityId", getSupervisorsByUniversity);
router.post("/projects", createProject); // Keep this one for project registration
router.get("/project", getProject);
router.get("/project/:studentId", getProjectById);
router.post("/project/:projectId/milestones", addMilestone);
router.put("/project/:projectId/milestones/:milestoneId", updateMilestone);
router.delete("/project/:projectId/milestones/:milestoneId", deleteMilestone);
router.put("/project/:projectId/milestones", updateProjectMilestones);
router.post("/milestones/:milestoneId/tasks", addTask);
router.put("/milestones/:milestoneId/tasks/:taskId", updateTask);
router.put("/tasks/:taskId/status", updateTaskStatus);
router.delete("/milestones/:milestoneId/tasks/:taskId", deleteTask);
router.post("/milestones/:milestoneId/meetings", addMeeting);
router.put("/milestones/:milestoneId/meetings/:meetingId", updateMeeting);
router.delete("/milestones/:milestoneId/meetings/:meetingId", deleteMeeting);

// Document routes
router.get("/documents/supervisor/:supervisorId", listDocuments); // Changed from /documents/:supervisorId/list
router.get("/documents/:id", getDocumentContent); // Changed from /documents/:id/content
router.get("/documents/:id/pdf", getDocumentPDF); // Serve PDF files directly with proper headers

module.exports = router;
