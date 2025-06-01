const express = require("express");
const {
  getUniAdminAccount,
  updateUniAdminAccount,
  registerSingleUser,
  registerBulkUsers,
  getUsersByUniversityId,
} = require("../controllers/uniAdminController");

const router = express.Router();

// UniAdmin account routes
router.get("/account", getUniAdminAccount);
router.put("/account", updateUniAdminAccount);
router.get("/users/:universityId", getUsersByUniversityId);
// Registration routes
router.post("/registration/single", registerSingleUser);
router.post("/registration/bulk", registerBulkUsers);

module.exports = router;
