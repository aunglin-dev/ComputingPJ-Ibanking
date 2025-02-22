import { Sequelize } from "sequelize";
import Admin from "./Model/admin.js";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.SQL_DB,
  process.env.UsernameForMssql,
  process.env.Password,
  {
    host: "localhost",
    dialect: "mssql",
    dialectOptions: {
      trustedConnection: true, // Windows Authentication, if needed
      enableArithAbort: true,
      trustServerCertificate: true, // For self-signed certificates
    },
    logging: false, // Optional: Disable logging of SQL queries
  }
);

const db = {};
db.Admin = Admin(sequelize);

const initDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Database sync error:", error);
  }
};

initDB();
export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};
export { sequelize, db };
