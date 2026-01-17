import express from "express";
import { getAdminDashboardStats } from "../controllers/superadminDashboardController.js";
import { getAllCustomers } from "../controllers/superadminCustomerController.js";
import { getAllVendors,getVendorById } from "../controllers/superadminVendorController.js";
import { getAllBids } from "../controllers/bidController.js";
import { importVendors } from "../controllers/vendorController.js";
import { upload } from "../middleware/upload.js";
// optional: adminAuthMiddleware

const router = express.Router();

// router.use(adminAuthMiddleware);

router.get("/dashboard-stats", getAdminDashboardStats);
router.get("/customers", getAllCustomers);
router.get("/vendors", getAllVendors);
router.get("/vendors/:id", getVendorById);
router.get("/bids", getAllBids);
router.post(
  "/vendors/import",
  upload.single("file"),
  importVendors
);


export default router;
