import express from "express";
import vendorAuth from "../middleware/vendorAuth.js";
import {
  createOrUpdateVendorProfile,
  getMyVendorProfile,
} from "../controllers/vendorProfileController.js";

const router = express.Router();

// Vendor creates / updates own profile
router.post("/", vendorAuth, createOrUpdateVendorProfile);

// Vendor gets own profile
router.get("/me", vendorAuth, getMyVendorProfile);

export default router;
