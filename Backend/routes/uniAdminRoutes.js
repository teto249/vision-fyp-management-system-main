const express = require("express");
const {
  getUniAdminAccount,
  updateUniAdminAccount,
} = require("../controllers/uniAdminController");

const router = express.Router();

// UniAdmin account routes
router.get("/account", getUniAdminAccount);
router.put("/account", updateUniAdminAccount);

module.exports = router;
