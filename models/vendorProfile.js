// models/VendorProfile.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const VendorProfile = sequelize.define(
    "VendorProfile",
    {
        vendorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        bussinessName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactPerson: {
            type: DataTypes.STRING,

            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        bussinessDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        serviceLocation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        experinceYears: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }
    ,
    {
        tableName: "vendorProfile",
        timestamps: true,
    }
);
export default VendorProfile;