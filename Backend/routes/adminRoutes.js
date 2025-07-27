const express = require("express");
const {
  // Admin account management
  getAdminAccount,
  updateAdminAccount,


  getUniversityById,
  getAllUniversitiesWithDetails,
  registerUniversity,
  getUniversityStatistics,
  getUniversityMembers,
  deleteUniversity,
  forceDeleteUniversity,
  
  // Dashboard
  getDashboardStats,
} = require("../controllers/adminController");

const router = express.Router();

// Admin account routes
router.get("/account", getAdminAccount);
router.put("/account", updateAdminAccount);
router.get('/universities/:id', getUniversityById);

router.get("/universities", getAllUniversitiesWithDetails);
// Remove the individual university details route since it's no longer needed


// University management routes
router.post("/registerUniversity", registerUniversity); // Make sure this matches frontend
router.get("/universities/:id/statistics", getUniversityStatistics);
router.get("/universities/:id/members", getUniversityMembers);
router.delete("/universities/:id", deleteUniversity);
router.delete("/universities/:id/force", forceDeleteUniversity);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);

module.exports = router;
