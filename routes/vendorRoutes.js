// routes/vendorAuthRoutes.js
import express from "express";
import {
  registerVendor,
  loginVendor,
  getVendorDashboard,
  getAllVendors
} from "../controllers/vendorController.js";
import vendorAuth from "../middleware/vendorAuth.js";
const router = express.Router();

router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.get("/dashboard", vendorAuth, getVendorDashboard);
// 🔹 GET ALL VENDORS (Admin / Super Admin)
router.get("/", getAllVendors);
export default router;
