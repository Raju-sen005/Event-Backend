import express from "express";
import { getAdminDashboardStats } from "../controllers/superadminDashboardController.js";
import { getAllCustomers } from "../controllers/superadminCustomerController.js";
import { getAllVendors } from "../controllers/superadminVendorController.js";
// optional: adminAuthMiddleware

const router = express.Router();

// router.use(adminAuthMiddleware);

router.get("/dashboard-stats", getAdminDashboardStats);
router.get("/customers", getAllCustomers);
router.get("/vendors", getAllVendors);
export default router;
