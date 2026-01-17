import { Vendor, VendorProfile } from "../models/index.js";

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
      include: [
        {
          model: VendorProfile,
          as: "profile",
          attributes: ["category", "serviceLocation"],
          required: false,
        },
      ],
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
      category: v.profile?.category || "-",
      joinedDate: v.createdAt,
      status: v.status,
      rating: 0,
      location: v.profile?.serviceLocation || "-",
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



/* =========================
   GET BY VENDORS (ADMIN)
========================= */
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [
        {
          model: VendorProfile,
          as: "profile",
        },
      ],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.fullName,
        email: vendor.email,
        phone: vendor.phone,
        status: vendor.status,
        joinedDate: vendor.createdAt,

        businessName: vendor.profile?.bussinessName,
        category: vendor.profile?.category,
        location: vendor.profile?.serviceLocation,
        description: vendor.profile?.bussinessDescription,
        experienceYears: vendor.profile?.experinceYears,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
