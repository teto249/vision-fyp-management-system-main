const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { 
  getSupervisorAccount, 
  updateSupervisorAccount, 
  uploadDocument, 
  listDocuments, 
  getDocumentContent,
  deleteDocument, 
  getStudentDocuments 
} = require("../controllers/supervisorController");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
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

// Add error handling middleware for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 100MB limit'
      });
    }
  }
  next(err);
});

module.exports = router;