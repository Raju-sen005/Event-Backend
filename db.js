// db.js
import sequelize from "./config/dbConfig.js";

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database Connected with Sequelize!");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

export default sequelize;