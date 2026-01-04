// models/Event.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Event = sequelize.define(
  "Event",
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

    name: DataTypes.STRING,
    customerName: DataTypes.STRING,
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    category: DataTypes.STRING,
    status: DataTypes.STRING,
    progress: DataTypes.INTEGER,
    nextAction: DataTypes.STRING,
    amount: DataTypes.INTEGER,
  },
  {
    tableName: "events",
    timestamps: true,
  }
);

export default Event;
