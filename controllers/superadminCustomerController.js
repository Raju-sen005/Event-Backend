import User from "../models/user.js";
import Event from "../models/event.js";
import { Op } from "sequelize";

/* =========================
   GET ALL CUSTOMERS (ADMIN)
========================= */
export const getAllCustomers = async (req, res) => {
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

        const users = await User.findAll({
            attributes: ["id", "fullName", "email", "createdAt", "status"],
            order: [["createdAt", "DESC"]],
        });

        // Events count per user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const eventsCreated = await Event.count({
                    where: { customerName: user.fullName },
                });

                return {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                    phone: "-", // agar future me add ho
                    joinedDate: user.createdAt,
                    eventsCreated,
                    status: user.status,
                    lastActive: "Recently", // future me activity log se
                };
            })
        );

        // Stats
        const total = await User.count();
        const active = await User.count({ where: { status: "active" } });
        const suspended = await User.count({ where: { status: "suspended" } });

        res.json({
            success: true,
            stats: { total, active, suspended },
            customers: usersWithStats,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
