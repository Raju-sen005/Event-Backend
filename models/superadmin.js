import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Superadmin = sequelize.define(
    "Superadmin",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "superadmins",
        timestamps: true,
    }
)

export default Superadmin;