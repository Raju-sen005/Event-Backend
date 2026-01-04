import express from "express";
import vendorAuth from "../middleware/vendorAuth.js";
import {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getActiveEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", vendorAuth, createEvent);        // Create event
router.get("/my", vendorAuth, getMyEvents);       // Vendor events
router.get("/:id", vendorAuth, getEventById);     // Single event
router.put("/:id", vendorAuth, updateEvent);      // Update event
router.delete("/:id", vendorAuth, deleteEvent);   // Delete event
// Admin
router.get("/", getAllEvents);
router.get("/active", getActiveEvents);
export default router;
