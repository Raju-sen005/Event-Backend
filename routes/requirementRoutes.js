import express from "express";
import {
  createRequirement,
  getOpenRequirements,
  getRequirementById,
  updateRequirement,
  closeRequirement,
  deleteRequirement,
  getAllRequirements
} from "../controllers/requirementController.js";

const router = express.Router();

// Customer / System
router.post("/", createRequirement);

// Vendor
router.get("/open", getOpenRequirements);

// Admin / System (GET ALL)
router.get("/", getAllRequirements);   // ✅ ADD THIS (ABOVE :id)

// Common
router.get("/:id", getRequirementById);
router.put("/:id", updateRequirement);
router.put("/:id/close", closeRequirement);
router.delete("/:id", deleteRequirement);

export default router;
