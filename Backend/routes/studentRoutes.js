const express = require("express");
const router = express.Router();
const {getStudentAccount,updateStudentAccount} = require("../controllers/studentController");

router.get("/account", getStudentAccount);
router.put("/account", updateStudentAccount);

module.exports = router;
