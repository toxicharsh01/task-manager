const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup controller
const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "password length must be greater then 6",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email)
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      if (existingUser.username === username)
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
    }

    // Hash password before saving
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();

    // Send response
    return res
      .status(201)
      .json({ success: true, message: "signup successfull", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login controller
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });

    // Compare password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res
        .status(400)
        .json({ success: false, message: "Email or password is wrong" });

    // Generate JWT token
    const jwtToken = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Send response with token
    return res.status(200).json({
      success: true,
      message: "Login Success",
      jwtToken,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { signupController, loginController };
