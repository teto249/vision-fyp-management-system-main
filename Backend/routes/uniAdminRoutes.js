const express = require("express");
const {
  getUniAdminAccount,
  updateUniAdminAccount,
    registerSingleUser,
  registerBulkUsers
} = require("../controllers/uniAdminController");
// const {
//   registerSingleUser,
//   registerBulkUsers
// } = require("../controllers/registrationController");

const router = express.Router();

// UniAdmin account routes
router.get("/account", getUniAdminAccount);
router.put("/account", updateUniAdminAccount);

// Registration routes
router.post("/registration/single", registerSingleUser);
router.post("/registration/bulk", registerBulkUsers);

module.exports = router;