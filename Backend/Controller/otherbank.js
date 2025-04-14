import { where } from "sequelize";
import { db, sequelize } from "../config.js";
import { tranType } from "../Utils/TranType.js";

export const fetchAllOtherBank = async (req, res) => {
  try {
    const resOtherBank = await db.OtherBank.findAll();

    console.log(res);
    res.status(200).json(resOtherBank);
  } catch (error) {
    console.error("Error fetching otherbanks:", error);
    throw error;
  }
};

export const fetchOtherBranchesByOtherBankId = async (req, res) => {
  try {
    const { BankId } = req.body;
    const resOtherBranches = await db.OtherBranches.findAll({
      where: { BankId },
    });

    if (resOtherBranches.length < 1) {
      res.status(201).json({ message: "No Data For this BankId" });
    }

    res.status(200).json(resOtherBranches);
  } catch (error) {
    console.error("Error fetching otherbanks:", error);
    throw error;
  }
};

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

  return true;
}

export const validateOtherBankTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      toAccountNo,
      amount,
      description,
      reqtranType,
      OtherBankId,
      OtherBranchId,
      phone,
      email,
      receiverName,
    } = req.body;

    // Validate input
    if (
      !fromAccountNo ||
      !toAccountNo ||
      !amount ||
      OtherBankId === null ||
      !OtherBranchId ||
      !email
    ) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find and lock accounts
    const [fromAccount] = await Promise.all([
      db.CustomerAccount.findOne({
        where: { AccountNo: fromAccountNo, UserId: userId },
        transaction,
        // lock: true,
      }),
    ]);

    if (!fromAccount) {
      await transaction.rollback();
      return res.status(400).json({ message: "From account cannot found" });
    }

    //Validate Email
    if (!isValidEmail(email)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Email Format Is wrong" });
    }
    //  Validate Other BankId and OtherBranch Id
    const [otherbank, otherbranch] = await Promise.all([
      db.OtherBank.findOne({
        where: { Id: OtherBankId },
        transaction,
      }),
      db.OtherBranches.findOne({
        where: { Id: OtherBranchId, BankId: OtherBankId },
        transaction,
      }),
    ]);

    if (!otherbank || !otherbranch) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "other bank or other branch is not undefined" });
    }

    //  Fetch Sender and Receiver
    const [sender] = await Promise.all([
      db.User.findOne({
        where: { UserId: fromAccount.UserId },
        transaction,
      }),
    ]);

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
      receiverName: receiverName,
      otherbank: otherbank.BankName,
      otherbranch: otherbranch.Name,
      OtherBankId,
      OtherBranchId,
      phone,
      email,
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

export const confirmOtherBankTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      toAccountNo,
      amount,
      description,
      OtherBankId,
      OtherBranchId,
      phone,
      email,
      receiverName,
      reqtranType,
    } = req.body;

    // Validate input
    if (
      !fromAccountNo ||
      !toAccountNo ||
      !amount ||
      OtherBankId === null ||
      !OtherBranchId
    ) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find and lock accounts
    const [fromAccount] = await Promise.all([
      db.CustomerAccount.findOne({
        where: { AccountNo: fromAccountNo, UserId: userId },
        transaction,
        // lock: true,
      }),
    ]);

    if (!fromAccount) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "One or both accounts not found" });
    }

    //  Validate Other BankId and OtherBranch Id
    const [otherbank, otherbranch] = await Promise.all([
      db.OtherBank.findOne({
        where: { Id: OtherBankId },
        transaction,
      }),
      db.OtherBranches.findOne({
        where: { Id: OtherBranchId, BankId: OtherBankId },
        transaction,
      }),
    ]);

    if (!otherbank || !otherbranch) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "other bank or other branch is not undefined" });
    }

    //  Fetch Sender and Receiver
    const [sender] = await Promise.all([
      db.User.findOne({
        where: { UserId: fromAccount.UserId },
        transaction,
      }),
    ]);

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
        ToAccountName: receiverName,
        Currency: "MMK",
        ToBank: OtherBankId,
        ToBranch: OtherBranchId,
        Phone: phone,
        Email: email,
        Status: "Success",
        TranType: reqtranType,
        TransactionDate: new Date(),
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
      OtherBank: otherbank.BankName,
      OtherBranch: otherbranch.Name,
      ToAccountName: newTransaction.ToAccountName,
      Currency: newTransaction.Currency,
      senderName: sender.FullName,
      phone,
      email,
      TranType: newTransaction.TranType,
      TransactionDate: newTransaction.newTransaction,
    };

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction: respondedTransaction,

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
