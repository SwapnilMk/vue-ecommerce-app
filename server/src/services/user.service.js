const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const createUserService = async (data) => {
    const {
        name,
        email,
        phone,
        password,
        role,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
    } = data;

    if (!name || !email || !phone || !password) {
        throw new Error("All required fields must be provided");
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        throw new Error("user is already registered");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role && role.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        postalCode: postalCode,
        country: country,
    });

    // Generate JWT
    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            addressLine1: newUser.addressLine1,
            addressLine2: newUser.addressLine2,
            city: newUser.city,
            state: newUser.state,
            postalCode: newUser.postalCode,
            country: newUser.country,
        },
        token,
    };
};

module.exports = { createUserService };
