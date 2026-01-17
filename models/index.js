import Vendor from "../models/vendor.js";
import VendorProfile from "../models/vendorProfile.js";

/* ======================
   ASSOCIATIONS
====================== */
Vendor.hasOne(VendorProfile, {
  foreignKey: "vendorId",
  as: "profile",
  onDelete: "CASCADE",
});

VendorProfile.belongsTo(Vendor, {
  foreignKey: "vendorId",
  as: "vendor",
});

export {
  Vendor,
  VendorProfile,
};
