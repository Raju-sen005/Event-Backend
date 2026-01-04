import User from "../models/user.js";
import Vendor from "../models/vendor.js";
import Event from "../models/event.js";
import Requirement from "../models/requirement.js";
import { Op } from "sequelize";

/* =========================
   ADMIN DASHBOARD STATS
========================= */
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Total users / customers
    const totalUsers = await User.count();

    // Total vendors
    const totalVendors = await Vendor.count();

    // Active events (Planning + Active + In Progress)
    const activeEvents = await Event.count({
      where: {
        status: {
          [Op.in]: ["Planning", "Active", "In Progress"],
        },
      },
    });

    // Total requirements
    const totalRequirements = await Requirement.count();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        activeEvents,
        totalRequirements
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
