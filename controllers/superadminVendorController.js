import Vendor from "../models/vendor.js";
import VendorProfile from "../models/vendorProfile.js";
import { Op } from "sequelize";

/* =========================
   GET ALL VENDORS (ADMIN)
========================= */
export const getAllVendors = async (req, res) => {
  try {
    const { status, search } = req.query;

    const where = {};

    // Status filter
    if (status && status !== "all") {
      where.status = status;
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const vendors = await Vendor.findAll({
      where,
      attributes: ["id", "fullName", "email", "phone", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    // Stats
    const total = await Vendor.count();
    const verified = await Vendor.count({ where: { status: "verified" } });
    const pending = await Vendor.count({ where: { status: "pending" } });
    const suspended = await Vendor.count({ where: { status: "suspended" } });

    // Map response (UI-friendly)
    const formattedVendors = vendors.map(v => ({
      id: v.id,
      name: v.fullName,
      email: v.email,
      phone: v.phone,
      service: "General", // later VendorProfile se dynamic
      joinedDate: v.createdAt,
      status: v.status,
      rating: 0,         // future: reviews table
      completedJobs: 0,  // future: events table
    }));

    res.json({
      success: true,
      stats: {
        total,
        verified,
        pending,
        suspended,
      },
      vendors: formattedVendors,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
