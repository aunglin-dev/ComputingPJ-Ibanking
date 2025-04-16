import { where } from "sequelize";
import { db, sequelize } from "../config.js";
import { tranType } from "../Utils/TranType.js";

export const fetchToAccNo = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { toAccountNo } = req.body;

    const resCustomerAcc = await db.CustomerAccount.findOne({
      where: { AccountNo: toAccountNo },
      transaction,
      // lock: true,
    });

    if (!resCustomerAcc) {
      await transaction.rollback();
      return res.status(400).json({ message: "To Account Not Found " });
    }

    const [userinfo, accountinfo] = await Promise.all([
      db.User.findOne({
        where: { UserId: resCustomerAcc?.UserId },
        transaction,
      }),
      db.AccountTypes.findOne({
        where: { AccountId: resCustomerAcc?.AccountId },
        transaction,
      }),
    ]);

    if (!userinfo || !accountinfo) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "User Info or Account Information not found" });
    }

    //  Commit transaction
    await transaction.commit();

    res.status(200).json({
      accountType: accountinfo.ProductName,
      receiverName: userinfo.FullName,
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    return res.status(500).json({
      success: false,
      message: "Fetech To Account failed",
      error: error.message,
    });
  }
};

export const validateTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      toAccountNo,
      amount,
      description,
      reqtranType,

      receiverName,
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
    if (reqtranType == tranType?.TransferOther) {
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
      reqtranType,
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
    if (reqtranType == tranType?.TransferOther) {
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
        ToAccountName: receiver.FullName,
        Currency: "MMK",
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
      ToAccountName: newTransaction.ToAccountName,
      Currency: newTransaction.Currency,
      senderName: sender.FullName,
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

// Remittance Transfer

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

  return true;
}

//Validate NRC

function validateNRC(nrc) {
  if (!nrc || typeof nrc !== "string") return false;

  const nrcPattern = /^(\d{1,2})\/([A-Za-z]{1,6})\/(\d{6})$/;

  // Test format
  const match = nrc.match(nrcPattern);
  if (!match) return false;

  const [_, townshipCode, townshipName, numbers] = match;

  //  Validate township code
  const townshipNum = parseInt(townshipCode, 10);
  if (townshipNum < 1 || townshipNum > 14) return false;

  //  Validate numbers
  return numbers.length === 6 && /^\d+$/.test(numbers);
}

export const validateRemittanceTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      NRC,
      amount,
      description,
      reqtranType,
      OtherBranchId,
      phone,
      transactionDate,
      email,
      receiverName,
    } = req.body;

    // Validate input
    if (!fromAccountNo || !NRC || !amount || !email || !OtherBranchId) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //Validate NRC
    if (!validateNRC(NRC)) {
      await transaction.rollback();
      return res.status(400).json({ message: "NRC Format is incorrect" });
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

    //  Fetch Sender
    const [sender] = await Promise.all([
      db.User.findOne({
        where: { UserId: fromAccount.UserId },
        transaction,
      }),
    ]);

    const [otherbranch] = await Promise.all([
      db.OtherBranches.findOne({
        where: { Id: OtherBranchId, BankId: 23 },
        transaction,
      }),
    ]);

    if (!otherbranch) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: " other branch is not undefined" });
    }

    // Check balance
    if (Number(fromAccount.Balance) < Number(amount)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    //  Commit transaction
    await transaction.commit();

    const returnTransactionDate =
      reqtranType == tranType.ScheduleTransferOtherBank
        ? transactionDate
        : new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

    res.status(200).json({
      fromAccountNo,
      NRC,
      amount,
      description,
      senderName: sender.FullName,
      receiverName: receiverName,
      phone,
      email,
      OtherBranchId,
      otherbranch: otherbranch.Name,
      transactionDate: returnTransactionDate,
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

export const confirmRemittanceTransfer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      fromAccountNo,
      NRC,
      amount,
      description,
      phone,
      email,
      receiverName,
      OtherBranchId,
      transactionDate,
      reqtranType,
    } = req.body;

    // Validate input
    if (!fromAccountNo || !NRC || !amount || !OtherBranchId) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!validateNRC(NRC)) {
      await transaction.rollback();
      return res.status(400).json({ message: "NRC Format is incorrect" });
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

    //  Fetch Sender and Receiver
    const [sender] = await Promise.all([
      db.User.findOne({
        where: { UserId: fromAccount.UserId },
        transaction,
      }),
    ]);

    const [otherbranch] = await Promise.all([
      db.OtherBranches.findOne({
        where: { Id: OtherBranchId, BankId: 23 },
        transaction,
      }),
    ]);

    if (!otherbranch) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: " other branch is not undefined" });
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
    ]);

    const insertedTransactionDate =
      reqtranType == tranType.ScheduleTransferOtherBank
        ? transactionDate
        : new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

    // Create transaction log
    const newTransaction = await db.TransferLog.create(
      {
        UserId: userId,
        FromAccount: fromAccountNo,
        TransactionId: generateTransactionId(),
        ToAccount: NRC,
        TransactionAmount: amount,
        Description: description,
        ToAccountName: receiverName,
        Currency: "MMK",
        ToBranch: OtherBranchId,
        Phone: phone,
        Email: email,
        Status: "Success",
        TranType: reqtranType,
        TransactionDate: insertedTransactionDate,
      },
      { transaction }
    );

    //  Commit transaction
    await transaction.commit();

    const respondedTransaction = {
      UserId: newTransaction.UserId,
      FromAccount: newTransaction.FromAccount,
      TransactionId: newTransaction.TransactionId,
      NRC,
      TransactionAmount: newTransaction.TransactionAmount,
      Description: newTransaction.Description,
      ToAccountName: newTransaction.ToAccountName,
      Currency: newTransaction.Currency,
      OtherBranch: otherbranch.Name,
      senderName: sender.FullName,
      phone,
      email,
      TranType: newTransaction.TranType,
      TransactionDate: newTransaction.TransactionDate,
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
