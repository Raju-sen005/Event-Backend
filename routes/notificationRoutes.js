import express from "express";
import vendorAuth from "../middleware/vendorAuth.js";
import {
  getMyNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/my", vendorAuth, getMyNotifications);
router.delete("/:id", vendorAuth, deleteNotification);

export default router;
