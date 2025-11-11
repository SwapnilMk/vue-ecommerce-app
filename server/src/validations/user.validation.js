const { body } = require("express-validator");

const createUserValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must be 10 digits"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("role").optional().isIn(["USER", "ADMIN"]).withMessage("Invalid role"),

    body("addressLine1").optional().isString(),
    body("addressLine2").optional().isString(),
    body("city").optional().isString(),
    body("state").optional().isString(),
    body("postalCode").optional().isString(),
    body("country").optional().isString(),
];


const loginUserValidation = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

module.exports = { createUserValidation, loginUserValidation };
