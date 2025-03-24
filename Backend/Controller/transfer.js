import { where } from "sequelize";
import { db, sequelize } from "../config.js";

export const validateTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, fromAccountNo, toAccountNo, amount, descrption } = req.body;

    // Validate input
    if (!fromAccountNo || !toAccountNo || !amount) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find and lock accounts
    const [fromAccount, toAccount] = await Promise.all([
      db.CustomerAccount.findOne({
        where: { AccountNo: fromAccountNo, UserId: userId },
        transaction,
        // lock: true,
      }),
      db.CustomerAccount.findOne({
        where: { AccountNo: toAccountNo },
        transaction,
        // lock: true,
      }),
    ]);

    if (!fromAccount || !toAccount) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "One or both accounts not found" });
    }

    // Check balance
    if (Number(fromAccount.Balance) < Number(amount)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    res.status(200).json({
      fromAccountNo,
      toAccountNo,
      amount,
      descrption,
      transactionDate: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    });
  } catch (error) {
    console.error("Transfer failed:", error);
    return res.status(500).json({
      success: false,
      message: "Transaction failed",
      error: error.message,
    });
  }
};

//Random TransId
function generateTransactionId() {
  const prefix = "TXN"; // Optional prefix
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}${randomPart}`;
}

export const confirmTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      toAccountNo,
      amount,
      description,
      tranType,
    } = req.body;

    // Validate input
    if (!fromAccountNo || !toAccountNo || !amount) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find and lock accounts
    const [fromAccount, toAccount] = await Promise.all([
      db.CustomerAccount.findOne({
        where: { AccountNo: fromAccountNo, UserId: userId },
        transaction,
        // lock: true,
      }),
      db.CustomerAccount.findOne({
        where: { AccountNo: toAccountNo },
        transaction,
        // lock: true,
      }),
    ]);

    if (!fromAccount || !toAccount) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "One or both accounts not found" });
    }

    // Check balance
    if (Number(fromAccount.Balance) < Number(amount)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    //  Perform atomic balance updates
    await Promise.all([
      db.CustomerAccount.update(
        { Balance: sequelize.literal(`Balance - ${amount}`) },
        {
          where: { AccountNo: fromAccountNo, UserId: userId },
          transaction,
        }
      ),
      db.CustomerAccount.update(
        { Balance: sequelize.literal(`Balance + ${amount}`) },
        {
          where: { AccountNo: toAccountNo },
          transaction,
        }
      ),
    ]);

    // Create transaction log
    const newTransaction = await db.TransferLog.create(
      {
        UserId: userId,
        FromAccount: fromAccountNo,
        TransactionId: generateTransactionId(),
        ToAccount: toAccountNo,
        TransactionAmount: amount,
        Description: description,
        Currency: "MMK",
        Status: "Success",
        TranType: tranType,
        TransactionDate: new Date(), // Use server timestamp
      },
      { transaction }
    );

    //  Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction: newTransaction,
      newBalance: fromAccount.Balance - amount, // Return updated balance
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Transfer failed:", error);
    return res.status(500).json({
      success: false,
      message: "Transaction failed",
      error: error.message,
    });
  }
};
