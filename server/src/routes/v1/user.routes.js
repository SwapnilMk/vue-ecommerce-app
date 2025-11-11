const express = require("express");
const { createUser } = require("../../controllers/user.controller.js");
const handleValidationErrors = require("../../middleware/validate.middleware.js");
const { createUserValidation } = require("../../validations/user.validation.js");

const router = express.Router();

//create user route
router.post("/", createUserValidation, handleValidationErrors, createUser);

module.exports = router;
