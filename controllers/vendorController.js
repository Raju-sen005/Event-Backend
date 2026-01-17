// controllers/vendorAuthController.js
import Vendor from "../models/vendor.js";
import Event from "../models/event.js";
import Bid from "../models/bid.js";
import Requirement from "../models/requirement.js";
import Notification from "../models/notification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import XLSX from "xlsx";
import { Op } from "sequelize";
/* =======================
   🔹 Vendor Signup
======================= */
export const registerVendor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
    } = req.body;

    // 1️⃣ Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3️⃣ Existing vendor check
    const existingVendor = await Vendor.findOne({ where: { email } });
    if (existingVendor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create vendor
    await Vendor.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      message: "Vendor registered successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================
   🔹 Vendor Login
======================= */
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Vendor check
    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    // 2️⃣ Active check
    if (!vendor.isActive) {
      return res.status(403).json({ message: "Vendor account disabled" });
    }

    // 3️⃣ Password verify
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4️⃣ JWT Token
    const token = jwt.sign(
      { id: vendor.id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Vendor login successful",
      token,
      user: {
        id: vendor.id,
        fullName: vendor.fullName,
        email: vendor.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    /* =====================
       1️⃣ Vendor Basic Info
    ===================== */
    const vendor = await Vendor.findByPk(vendorId, {
      attributes: ["id", "fullName", "email", "phone", "createdAt"],
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    /* =====================
       2️⃣ Stats (Dynamic)
    ===================== */
    const activeEventsCount = await Event.count({
      where: {
        vendorId,
        status: { [Op.in]: ["In Progress", "Confirmed"] },
      },
    });

    const pendingBidsCount = await Bid.count({
      where: {
        vendorId,
        status: "Pending",
      },
    });

    const monthlyEarnings = await Event.sum("amount", {
      where: {
        vendorId,
        status: "Completed",
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const rating = 4.8; // ⭐ later reviews table se dynamic kar sakte ho

    /* =====================
       3️⃣ Active Events
    ===================== */
    const activeEvents = await Event.findAll({
      where: {
        vendorId,
        status: { [Op.in]: ["In Progress", "Confirmed", "Planning"] },
      },
      attributes: [
        "id",
        "name",
        "customerName",
        "date",
        "location",
        "category",
        "status",
        "progress",
        "nextAction",
      ],
      order: [["date", "ASC"]],
      limit: 5,
    });

    /* =====================
       4️⃣ New Requirements
    ===================== */
    const newRequirements = await Requirement.findAll({
      where: {
        status: "Open",
      },
      attributes: [
        "id",
        "title",
        "eventType",
        "date",
        "location",
        "budgetMin",
        "budgetMax",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: 6,
    });

    /* =====================
       5️⃣ Upcoming Deadlines
    ===================== */
    const upcomingDeadlines = await Event.findAll({
      where: {
        vendorId,
        date: {
          [Op.gte]: new Date(),
        },
      },
      attributes: ["name", "date", "status"],
      order: [["date", "ASC"]],
      limit: 3,
    });

    /* =====================
       6️⃣ Recent Notifications
    ===================== */
    const recentNotifications = await Notification.findAll({
      where: { vendorId },
      attributes: ["id", "message", "type", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    /* =====================
       FINAL RESPONSE
    ===================== */
    res.json({
      vendor,
      stats: {
        activeEvents: activeEventsCount,
        pendingBids: pendingBidsCount,
        monthlyEarnings: monthlyEarnings || 0,
        rating,
      },
      activeEvents,
      newRequirements,
      upcomingDeadlines,
      recentNotifications,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================
   🔹 Get All Vendors
======================= */
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      attributes: [
        "id",
        "fullName",
        "email",
        "phone",
        "isActive",
        "createdAt",
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: vendors.length,
      vendors,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const importVendors = async (req, res) => {
  try {
    // ✅ SAFETY CHECK
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please select an Excel file.",
      });
    }


    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    if (!sheetData.length) {
      return res.status(400).json({
        message: "Excel file is empty",
      });
    }

    let inserted = 0;
    let skipped = 0;

    for (const row of sheetData) {
      // ✅ REQUIRED FIELDS CHECK
      if (!row.email || !row.name) {
        skipped++;
        continue;
      }
      const hashedPassword = await bcrypt.hash("Vendor@123", 10);
      // ✅ DUPLICATE SAFE INSERT
      const [vendor, created] = await Vendor.findOrCreate({
        where: { email: row.email },
        defaults: {
          fullName: row.name,           // ✅ REQUIRED
          name: row.name,
          email: row.email,
          phone: row.phone || "",
          category: row.category || "",
          status: row.status || "pending",
          rating: row.rating || 0,
          location: row.location || "",
          password: hashedPassword,     // ✅ REQUIRED
        },
      });

      if (created) inserted++;
      else skipped++;
    }

    res.json({
      message: "Vendors imported successfully",
      inserted,
      skipped,
    });
  } catch (error) {
    console.error("VENDOR IMPORT ERROR:", error);
    res.status(500).json({
      message: "Vendor import failed",
      error: error.message,
    });
  }
};
