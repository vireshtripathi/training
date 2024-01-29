const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { User } = require("../models");

//Validation

const loginUserValidation = [
  body("password")
    .notEmpty()
    .withMessage("password cannot be empty")
    .isLength({ min: 6, max: 10 })
    .withMessage("password must be between 6 and 10 characters"),
  body("mobile")
    .notEmpty()
    .withMessage("mobile cannot be empty")
    .isLength({ min: 10 })
    .withMessage("mobile must be at least 10 digit"),
];

// Get User by ID

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const UserDetails = await User.findByPk(id);
    if (!UserDetails) {
      return res.status(404).json({ error: "user not found" });
    }
    res
      .status(200)
      .json({ status: 200, user: UserDetails, message: "successfully" });
  } catch (error) {
    console.error("Error getting user details:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//Add New User

router.post("/user", async (req, res) => {
  const { name, password, mobile } = req.body;
  try {
    const newUser = await User.create({ name, password, mobile });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, message: "Internal Server Error" });
  }
});

// Login Api

router.post("/user/login", loginUserValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { password, mobile } = req.body;
    try {
      const user = await User.findOne({ where: { mobile } });
      if (user && (await user.comparePassword(password))) {
        const token = jwt.sign(
          { id: user.id, mobile: user.mobile },
          "your-secret-key",
          { expiresIn: "1h" }
        );
        res.json({ user, token: token, message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(422).json({ errors: errors.array() });
});

module.exports = router;
