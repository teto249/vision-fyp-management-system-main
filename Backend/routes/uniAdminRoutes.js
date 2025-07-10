const express = require("express");
const {
  getUniAdminAccount,
  updateUniAdminAccount,
  registerSingleUser,
  registerBulkUsers,
  getUsersByUniversityId,
  deleteUser,
  bulkDeleteUsers,
  getDashboardAnalytics,
} = require("../controllers/uniAdminController");


const router = express.Router();

// UniAdmin account routes
router.get("/account", getUniAdminAccount);
router.put("/account", updateUniAdminAccount);
router.get("/users/:universityId", getUsersByUniversityId);
router.get("/analytics/:universityId", getDashboardAnalytics);

// Registration routes
router.post("/registration/single", registerSingleUser);
router.post("/registration/bulk", registerBulkUsers);

// User deletion routes
router.delete("/users/:userType/:userId", deleteUser);
router.delete("/users/bulk", bulkDeleteUsers);

module.exports = router;

