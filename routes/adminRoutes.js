import express from "express";
import { getAdminDashboardStats } from "../controllers/superadminDashboardController.js";
import { getAllCustomers, getCustomerById } from "../controllers/superadminCustomerController.js";
import { getAllVendors, getVendorById } from "../controllers/superadminVendorController.js";
import { getAllBids } from "../controllers/bidController.js";
import { importVendors } from "../controllers/vendorController.js";
import { getAllEvents } from "../controllers/eventController.js"
import { upload } from "../middleware/upload.js";
// optional: adminAuthMiddleware

const router = express.Router();

// router.use(adminAuthMiddleware);

router.get("/dashboard-stats", getAdminDashboardStats);
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerById);
router.get("/vendors", getAllVendors);
router.get("/vendors/:id", getVendorById);
router.get("/bids", getAllBids);
router.get("/events", getAllEvents)
router.post(
  "/vendors/import",
  upload.single("file"),
  importVendors
);


export default router;
