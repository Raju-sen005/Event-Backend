import Requirement from "../models/requirement.js";

/* =========================
   CREATE REQUIREMENT
   (Customer / System)
========================= */
export const createRequirement = async (req, res) => {
  try {
    const {
      title,
      eventType,
      location,
      date,
      budgetMin,
      budgetMax,
    } = req.body;

    if (
      !title ||
      !eventType ||
      !location ||
      !date ||
      !budgetMin ||
      !budgetMax
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const requirement = await Requirement.create({
      title,
      eventType,
      location,
      date,
      budgetMin,
      budgetMax,
      status: "Open",
    });

    res.status(201).json({
      message: "Requirement created successfully",
      requirement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL REQUIREMENTS
   (Admin / System)
========================= */
export const getAllRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: requirements.length,
      requirements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================
   GET ALL OPEN REQUIREMENTS
   (Vendor Dashboard)
========================= */
export const getOpenRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.findAll({
      where: { status: "Open" },
      order: [["createdAt", "DESC"]],
    });

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET REQUIREMENT BY ID
========================= */
export const getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id);

    if (!requirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    res.json(requirement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE REQUIREMENT
   (Admin / System)
========================= */
export const updateRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id);

    if (!requirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    const {
      title,
      eventType,
      location,
      date,
      budgetMin,
      budgetMax,
      status,
    } = req.body;

    await requirement.update({
      title,
      eventType,
      location,
      date,
      budgetMin,
      budgetMax,
      status,
    });

    res.json({
      message: "Requirement updated successfully",
      requirement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CLOSE REQUIREMENT
========================= */
export const closeRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id);

    if (!requirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    requirement.status = "Closed";
    await requirement.save();

    res.json({
      message: "Requirement closed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE REQUIREMENT
========================= */
export const deleteRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findByPk(req.params.id);

    if (!requirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    await requirement.destroy();

    res.json({ message: "Requirement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
