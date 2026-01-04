import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔹 Register User
export const registerUser = async (req, res) => {
  try {

    const { fullName, email, password, confirmPassword } = req.body;

    // 1️⃣ All fields check
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3️⃣ Email exists check
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Login User
// 🔹 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ ADD THIS
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended. Contact support.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        status: user.status, // ✅ optional but useful
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get All Users
// 🔹 Get All Users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "fullName", "email", "status", "createdAt"],
      order: [["id", "DESC"]],
    });

    const total = users.length;
    const active = users.filter(u => u.status === "active").length;
    const suspended = users.filter(u => u.status === "suspended").length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        suspended,
      },
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

