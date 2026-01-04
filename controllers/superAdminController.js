import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SuperAdmin from "../models/superadmin.js";

export const createSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await SuperAdmin.create({
      email,
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      message: "Super Admin created",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const admin = await SuperAdmin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // if (otp !== process.env.STATIC_OTP) {
    //   return res.status(401).json({ message: "Invalid OTP" });
    // }

    const token = jwt.sign(
      { id: admin.id, role: "super-admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
  success: true,
  token,
  user: {
    id: admin.id,
    email: admin.email,
    role: "super-admin",
    name: "Super Admin",
    isVerified: true,
  },
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
