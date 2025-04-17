import { Sequelize, Op } from "sequelize";
import Admin from "./Model/admin.js";
import User from "./Model/User.js";
import CustomerAccount from "./Model/CustomerAccount.js";
import AccountTypes from "./Model/AccountTypes.js";
import TransferLog from "./Model/TransferLog.js";
import OtherBank from "./Model/OtherBank.js";
import OtherBranches from "./Model/OtherBranches.js";

import dotenv from "dotenv";
import Beneficiary from "./Model/Beneficiary.js";
import TransactionLimit from "./Model/TransactionLimit.js";
dotenv.config();

const sequelize = new Sequelize(
  process.env.SQL_DB,
  process.env.UsernameForMssql,
  process.env.Password,
  {
    host: "localhost",
    dialect: "mssql",
    dialectOptions: {
      trustedConnection: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
    logging: false, // Optional: Disable logging of SQL queries
  }
);

const db = {};

//Database Init
db.Admin = Admin(sequelize);
db.User = User(sequelize);
db.CustomerAccount = CustomerAccount(sequelize);
db.AccountTypes = AccountTypes(sequelize);
db.TransferLog = TransferLog(sequelize);
db.OtherBranches = OtherBranches(sequelize);
db.OtherBank = OtherBank(sequelize);
db.Beneficary = Beneficiary(sequelize);
db.TransactionLimit = TransactionLimit(sequelize);

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
export { sequelize, db, Op };
