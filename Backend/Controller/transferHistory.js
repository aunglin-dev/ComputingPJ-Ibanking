import { where } from "sequelize";
import { db, sequelize, Op } from "../config.js";
import { Parser } from "json2csv";

export const fetchAllTransactionHistory = async (req, res) => {
  try {
    let { fromDate, toDate, trantype } = req.body;

    fromDate = fromDate ?? Date.now();
    toDate = toDate ?? Date.now();

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

export const exportCSV = async (req, res) => {
  try {
    let { fromDate, toDate, trantype } = req.body;

    fromDate = fromDate ?? Date.now();
    toDate = toDate ?? Date.now();

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

    const fields = Object.keys(allTransactionHistory[0].dataValues);
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(allTransactionHistory);

    res.header("Content-Type", "text/csv");
    res.attachment("export.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Transaction History", error);
    throw error;
  }
};
