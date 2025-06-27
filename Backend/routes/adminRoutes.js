const express = require("express");
const {
  // Admin account management
  getAdminAccount,
  updateAdminAccount,

  // Institution management
  // registerInstitution,
  // getInstitutionById,

  // University management
  getUniversityById,
  getAllUniversitiesWithDetails,
  registerUniversity,
  getUniversityStatistics,
  getUniversityMembers,
  
  // Dashboard
  getDashboardStats,
} = require("../controllers/adminController");

const router = express.Router();

// Admin account routes
router.get("/account", getAdminAccount);
router.put("/account", updateAdminAccount);
router.get('/universities/:id', getUniversityById);
// ...existing code...
router.get("/universities", getAllUniversitiesWithDetails);
// Remove the individual university details route since it's no longer needed

// Institution management routes
// router.post("/institution", registerInstitution);
// router.get("/institution/:id", getInstitutionById);

// University management routes
router.post("/registerUniversity", registerUniversity); // Make sure this matches frontend
router.get("/universities/:id/statistics", getUniversityStatistics);
router.get("/universities/:id/members", getUniversityMembers);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);

module.exports = router;
