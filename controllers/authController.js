const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc  Register new user
// @route POST /api/signup
const signup = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);   // 👈 add this

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      console.log("Validation failed");
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please log in.'
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Login user
// @route POST /api/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, login };
