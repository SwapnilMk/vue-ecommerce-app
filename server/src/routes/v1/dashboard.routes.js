const express = require("express");
const router = express.Router();
const { getDashboardData, getOrderChartData } = require("../../controllers/dashboard.controller.js");
const { protect, isAdmin } = require("../../middleware/auth.middleware.js");

router.get("/stats", protect, isAdmin, getDashboardData);
router.get("/chart", protect, isAdmin, getOrderChartData)

module.exports = router;