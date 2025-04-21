import { where } from "sequelize";
import { db, sequelize, Op } from "../config.js";

export const fetchAllTransactionHistory = async (req, res) => {
  try {
    const { fromDate, toDate, trantype } = req.body;

    console.log(fromDate, toDate);
    const whereClause = {
      TransactionDate: {
        [Op.between]: [fromDate, toDate],
      },
    };

    //Add TranType
    if (trantype) {
      whereClause.TranType = trantype;
    }

    const allTransactionHistory = await db.TransferLog.findAll({
      where: whereClause,
    });

    res.status(200).json({
      message: "Transaction History Retrieve successfully",
      data: allTransactionHistory,
    });
  } catch (error) {
    console.error("Transaction History", error);
    throw error;
  }
};
