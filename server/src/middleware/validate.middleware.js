const { validationResult } = require("express-validator");

//validation middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.param,
            message: err.msg,
        }));

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: formattedErrors,
        });
    }

    next();
};

module.exports = handleValidationErrors;
