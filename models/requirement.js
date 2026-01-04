import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Requirement = sequelize.define(
  "Requirement",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    budgetMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    budgetMax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "Open", // Open | Closed
    },
  },
  {
    tableName: "requirements",
    timestamps: true,
  }
);

export default Requirement;
