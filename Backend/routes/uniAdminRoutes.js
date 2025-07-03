const express = require("express");
const {
  getUniAdminAccount,
  updateUniAdminAccount,
  registerSingleUser,
  registerBulkUsers,
  getUsersByUniversityId,
  deleteUser,
  bulkDeleteUsers,
} = require("../controllers/uniAdminController");
const { authenticateUniAdmin } = require("../middleware/auth");


const router = express.Router();

// UniAdmin account routes
router.get("/account", authenticateUniAdmin, getUniAdminAccount);
router.put("/account", authenticateUniAdmin, updateUniAdminAccount);
router.get("/users/:universityId", authenticateUniAdmin, getUsersByUniversityId);

// Registration routes
router.post("/registration/single", authenticateUniAdmin, registerSingleUser);
router.post("/registration/bulk", authenticateUniAdmin, registerBulkUsers);

// User deletion routes
router.delete("/users/:userType/:userId", authenticateUniAdmin, deleteUser);
router.delete("/users/bulk", authenticateUniAdmin, bulkDeleteUsers);

module.exports = router;

