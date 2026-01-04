import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Bid = sequelize.define(
  "Bid",
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

    requirementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending", // Pending | Approved | Rejected
    },
  },
  {
    tableName: "bids",
    timestamps: true,
  }
);

export default Bid;
