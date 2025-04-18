import { where } from "sequelize";
import { db, sequelize } from "../config.js";
import moment from "moment";
import User from "../Model/User.js";

export const fetchAllTransferLogs = async (req, res) => {
  try {
    const totalCount = await db.TransferLog.count();

    res.status(200).json({
      message: "Transfer counts grouped by transaction type (short names)",
      data: totalCount,
    });
  } catch (error) {
    console.error("Error fetching transfer :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchAllUserTypes = async (req, res) => {
  try {
    const totalCount = await db.User.count({
      where: {
        UserType: "Registered",
      },
    });

    res.status(200).json({
      message: "All User Types Retrieved Succesffull",
      data: totalCount,
    });
  } catch (error) {
    console.error("Error fetching User Types :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransferSummaryByTranType = async (req, res) => {
  try {
    const result = await db.TransferLog.findAll({
      attributes: [
        "TranType",
        [sequelize.fn("COUNT", sequelize.col("Id")), "count"],
      ],
      group: ["TranType"],
      order: [[sequelize.fn("COUNT", sequelize.col("Id")), "DESC"]],
      raw: true,
    });

    // Map TranType to short names (customize as needed)
    const shortNamedResult = result.map((item) => ({
      TranType: getShortName(item.TranType),
      count: item.count,
    }));

    res.status(200).json({
      message: "Transfer counts grouped by transaction type (short names)",
      data: shortNamedResult,
    });
  } catch (error) {
    console.error("Error fetching transfer by TranType:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to shorten names
const getShortName = (type) => {
  if (!type) return "Other";
  const map = {
    TransferOwnerAccount: "TO",
    TransferOtherAccount: "TOT",
    TransferOtherBank: "TOB",
    ScheduleTransferOtherAccount: "STO",
    ScheduleTransferOtherBank: "STB",
    RemittanceTransfer: "R",
  };
  return map[type] || type.slice(0, 10); // fallback to truncated name
};
