// models/Vendor.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      // pending | verified | suspended
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "vendors",
    timestamps: true,
  }
);

export default Vendor;
