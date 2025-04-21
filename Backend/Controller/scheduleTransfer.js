import { db, sequelize } from "../config.js";
import { tranType } from "../Utils/TranType.js";
import { TRANSACTION_STATUS } from "../Utils/TransactionStatus.js";

export const validateScheduleTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      toAccountNo,
      amount,
      description,
      reqtranType,
      transactionDate,
      receiverName,
    } = req.body;

    // Validate input
    if (!fromAccountNo || !toAccountNo || !amount || !transactionDate) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const transactionDateObj = new Date(transactionDate);
    transactionDateObj.setHours(0, 0, 0, 0);

    //Check Transaction Date
    if (transactionDateObj <= currentDate) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Future Transasction Date cannot be in the past",
      });
    }

    //  Find and lock accounts
    const [fromAccount, toAccount] = await Promise.all([
      db.CustomerAccount.findOne({
        where: { AccountNo: fromAccountNo, UserId: userId },
        transaction,
      }),
      db.CustomerAccount.findOne({
        where: { AccountNo: toAccountNo },
        transaction,
      }),
    ]);

    if (!fromAccount || !toAccount) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "One or both accounts not found" });
    }

    //  Fetch Sender and Receiver
    const [sender, receiver] = await Promise.all([
      db.User.findOne({
        where: { UserId: fromAccount.UserId },
        transaction,
      }),
      db.User.findOne({
        where: { UserId: toAccount.UserId },
        transaction,
      }),
    ]);

    console.log(reqtranType);
    //  Validation For Other Account
    if (reqtranType == tranType.ScheduleTransferOther) {
      console.log(fromAccount.UserId, toAccountNo.UserId);
      if (fromAccount?.UserId == toAccount?.UserId) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Cannot Transfer between Own Accounts" });
      }
    }

    // Check balance
    if (Number(fromAccount.Balance) < Number(amount)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    //  Commit transaction
    await transaction.commit();

    res.status(200).json({
      fromAccountNo,
      toAccountNo,
      amount,
      description,
      senderName: sender.FullName,
      receiverName: receiver.FullName,
      transactionDate: transactionDate,
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

export const confirmScheduleTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      toAccountNo,
      amount,
      transactionDate,
      description,
      reqtranType,
    } = req.body;

    // Validate input
    if (!fromAccountNo || !toAccountNo || !amount || !transactionDate) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const transactionDateObj = new Date(transactionDate);
    transactionDateObj.setHours(0, 0, 0, 0);

    //Check Transaction Date
    if (transactionDateObj <= currentDate) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Future Transasction Date cannot be in the past",
      });
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
        .status(400)
        .json({ message: "One or both accounts not found" });
    }

    //  Fetch Sender and Receiver
    const [sender, receiver] = await Promise.all([
      db.User.findOne({
        where: { UserId: fromAccount.UserId },
        transaction,
      }),
      db.User.findOne({
        where: { UserId: toAccount.UserId },
        transaction,
      }),
    ]);

    //  Validation For Other Account
    if (reqtranType == tranType?.ScheduleTransferOtherAccount) {
      if (fromAccount?.UserId == toAccount?.UserId) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Cannot Transfer between Own Accounts" });
      }
    }

    // Check balance
    if (Number(fromAccount.Balance) < Number(amount)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    //  Perform atomic balance updates
    // await Promise.all([
    //   db.CustomerAccount.update(
    //     { Balance: sequelize.literal(`Balance - ${amount}`) },
    //     {
    //       where: { AccountNo: fromAccountNo, UserId: userId },
    //       transaction,
    //     }
    //   ),
    //   db.CustomerAccount.update(
    //     { Balance: sequelize.literal(`Balance + ${amount}`) },
    //     {
    //       where: { AccountNo: toAccountNo },
    //       transaction,
    //     }
    //   ),
    // ]);

    // Create transaction log
    const newTransaction = await db.TransferLog.create(
      {
        UserId: userId,
        FromAccount: fromAccountNo,
        TransactionId: generateTransactionId(),
        ToAccount: toAccountNo,
        TransactionAmount: amount,
        Description: description,
        ToAccountName: receiver.FullName,
        Currency: "MMK",
        Status: TRANSACTION_STATUS.PENDING,
        TranType: reqtranType,
        TransactionDate: transactionDate,
      },
      { transaction }
    );

    //  Commit transaction
    await transaction.commit();

    const respondedTransaction = {
      UserId: newTransaction.UserId,
      FromAccount: newTransaction.FromAccount,
      TransactionId: newTransaction.TransactionId,
      ToAccount: newTransaction.ToAccount,
      TransactionAmount: newTransaction.TransactionAmount,
      Description: newTransaction.Description,
      ToAccountName: newTransaction.ToAccountName,
      Currency: newTransaction.Currency,
      senderName: sender.FullName,
      TranType: newTransaction.TranType,
      TransactionDate: newTransaction.TransactionDate,
    };

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction: respondedTransaction,
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
