import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      defaultValue: "info", 
      // info | success | warning
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
