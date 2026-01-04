import Notification from "../models/notification.js";

/* =========================
   CREATE NOTIFICATION
   (System / Admin / Logic)
========================= */
export const createNotification = async (vendorId, message, type = "info") => {
  try {
    await Notification.create({
      vendorId,
      message,
      type,
    });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};

/* =========================
   GET MY NOTIFICATIONS
   (Vendor)
========================= */
export const getMyNotifications = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const notifications = await Notification.findAll({
      where: { vendorId },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE NOTIFICATION
========================= */
export const deleteNotification = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const notificationId = req.params.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, vendorId },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
