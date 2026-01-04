import VendorProfile from "../models/vendorProfile.js";

/* =========================
   CREATE / UPDATE VENDOR PROFILE
   (Vendor khud)
========================= */
export const createOrUpdateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const {
      bussinessName,
      contactPerson,
      email,
      phone,
      bussinessDescription,
      serviceLocation,
      experinceYears,
    } = req.body;

    // Required fields validation
    if (
      !bussinessName ||
      !contactPerson ||
      !email ||
      !phone ||
      !serviceLocation
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // Check if profile already exists
    let profile = await VendorProfile.findOne({
      where: { vendorId },
    });

    if (profile) {
      // 🔁 Update profile
      await profile.update({
        bussinessName,
        contactPerson,
        email,
        phone,
        bussinessDescription,
        serviceLocation,
        experinceYears,
      });

      return res.json({
        message: "Vendor profile updated successfully",
        profile,
      });
    }

    // ➕ Create profile
    profile = await VendorProfile.create({
      vendorId,
      bussinessName,
      contactPerson,
      email,
      phone,
      bussinessDescription,
      serviceLocation,
      experinceYears,
    });

    res.status(201).json({
      message: "Vendor profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   GET LOGGED-IN VENDOR PROFILE
========================= */
export const getMyVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const profile = await VendorProfile.findOne({
      where: { vendorId },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Vendor profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
