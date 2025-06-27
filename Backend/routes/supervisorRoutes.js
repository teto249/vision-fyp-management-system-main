const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { 
  getSupervisorAccount, 
  updateSupervisorAccount, 
  uploadDocument, 
  listDocuments,   getDocumentContent,
  getDocumentPDF,
  deleteDocument, 
  getStudentDocuments,
  getSupervisedStudents,
  getStudentProject,
  getAllProjects,
  getSupervisedStudentsWithProjects,
  getStudentProjectDetails,
  updateProject,
  updateMilestone,
  addTask,
  updateTaskStatus,
  addFeedback,
  deleteTask,
  deleteMeeting,
  deleteMilestone,
  generateAIReport
} = require("../controllers/supervisorController");


// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    fieldSize: 50 * 1024 * 1024 // 50MB field limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  }
}).single('document');

// Account management routes
router.get("/account", getSupervisorAccount);
router.put("/account", updateSupervisorAccount);

// Document management routes
router.get("/documents/:supervisorId/list", listDocuments); // List documents (metadata only)
router.get("/documents/:id/content", getDocumentContent); // Get single document with content
router.get("/documents/:id/pdf", getDocumentPDF); // Serve PDF files directly with proper headers

// Debug route to test PDF serving
router.get("/documents/:id/test", async (req, res) => {
  try {
    const { id } = req.params;
    const Document = require('../models/Document');
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json({
      id: document.id,
      title: document.title,
      fileType: document.fileType,
      fileName: document.fileName,
      filePath: document.filePath,
      hasFileContent: !!document.fileContent,
      pdfUrl: `http://localhost:3000/api/supervisor/documents/${id}/pdf`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/documents/upload", (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    next();
  });
}, uploadDocument);

router.delete("/documents/:documentId", deleteDocument);
router.get("/students/:studentId/documents", getStudentDocuments);

// Supervisor-student relationship routes
router.get('/:supervisorId/students', getSupervisedStudents);
router.get('/:supervisorId/students/:studentId/project', getStudentProject);
router.get('/:supervisorId/projects', getAllProjects);
router.get('/:supervisorId/students-with-projects', getSupervisedStudentsWithProjects);
router.get('/:supervisorId/students/:studentId/project', getStudentProjectDetails);

// Project management routes
router.put('/:supervisorId/projects/:projectId', updateProject);
router.put('/:supervisorId/milestones/:milestoneId', updateMilestone);

// Task management routes
router.post('/:supervisorUsername/milestones/:milestoneId/tasks', addTask);
router.put('/:supervisorUsername/tasks/:taskId/status', updateTaskStatus);
router.post('/:supervisorUsername/tasks/:taskId/feedback', addFeedback);
router.delete('/:supervisorUsername/tasks/:taskId', deleteTask);

// Meeting management routes
router.delete('/:supervisorUsername/meetings/:meetingId', deleteMeeting);

// Milestone management routes
router.delete('/:supervisorUsername/milestones/:milestoneId', deleteMilestone);


// Add error handling middleware for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  next(err);
});

// AI Report generation
router.post('/:supervisorId/ai-report', generateAIReport);

module.exports = router;