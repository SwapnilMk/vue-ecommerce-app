const express = require("express");
const { createUser, loginUser, getAllUsers } = require("../../controllers/user.controller.js");
const handleValidationErrors = require("../../middleware/validate.middleware.js");
const { createUserValidation, loginUserValidation } = require("../../validations/user.validation.js");
const { protect, isAdmin } = require("../../middleware/auth.middleware.js");

const router = express.Router();

//create user route
router.post("/", createUserValidation, handleValidationErrors, createUser);
router.post("/login", loginUserValidation, handleValidationErrors, loginUser);

// Admin only
router.get("/", protect, isAdmin, getAllUsers);

module.exports = router;
