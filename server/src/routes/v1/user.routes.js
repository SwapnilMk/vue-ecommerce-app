const express = require("express");
const { createUser, loginUser } = require("../../controllers/user.controller.js");
const handleValidationErrors = require("../../middleware/validate.middleware.js");
const { createUserValidation, loginUserValidation } = require("../../validations/user.validation.js");

const router = express.Router();

//create user route
router.post("/", createUserValidation, handleValidationErrors, createUser);
router.post("/login", loginUserValidation, handleValidationErrors, loginUser)

module.exports = router;
