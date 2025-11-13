const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../../controllers/dashboard.controller.js");
const { protect, isAdmin } = require("../../middleware/auth.middleware.js");

router.get("/", protect, isAdmin, getDashboardData);

module.exports = router;