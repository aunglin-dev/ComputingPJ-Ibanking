import { where } from "sequelize";
import { db, sequelize, Op } from "../config.js";
import { tranType } from "../Utils/TranType.js";
import AccountTypes from "../Model/AccountTypes.js";

export const createBeneficiary = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      userId,
      toAccountNo,
      receiverName,
      nickname,
      reqtranType,
      description,
      phone,
      email,
      otherBranchId,
      otherBankId,
    } = req.body;
    // Validate input
    if (!nickname || !toAccountNo) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find and Nicknames
    const [fromAccount, toAccount, nicknames, duplicateToAccount] =
      await Promise.all([
        db.CustomerAccount.findAll({
          where: { UserId: userId },
          transaction,
        }),

        db.CustomerAccount.findOne({
          where: { AccountNo: toAccountNo },
          transaction,
        }),

        db.Beneficary.findAll({
          where: {
            Nickname: nickname,
            UserId: userId,

            [Op.or]: [
              { IsDelete: 0 }, // Active records (0)
              { IsDelete: null }, // Records never deleted (NULL)
            ],
          },
          transaction,
        }),

        db.Beneficary.findAll({
          where: {
            AccountNo: toAccountNo,
            UserId: userId,

            [Op.or]: [
              { IsDelete: 0 }, // Active records (0)
              { IsDelete: null }, // Records never deleted (NULL)
            ],
          },
          transaction,
        }),
      ]);

    if (!toAccount) {
      await transaction.rollback();
      return res.status(400).json({ message: "To Account No is  not found" });
    }

    //Check Adding Self Account To Beneficiary
    const checkSelfBene = await fromAccount.some(
      (el) => el.AccountNo === toAccount.AccountNo
    );

    if (checkSelfBene) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "You cannot Add Ur Own Account To Beneficiary" });
    }

    //Check Duplicate To Account
    if (duplicateToAccount.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Duplicated To Account" });
    }

    //Check Duplicate NickName
    if (nicknames.length > 0) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "That NickName is  already defined" });
    }

    //Insert a row
    const newBeneficiary = await db.Beneficary.create(
      {
        UserId: userId,
        AccountNo: toAccountNo,
        Type: reqtranType,
        Description: description,
        NickName: nickname,
        AccountName: receiverName,
        Phone: phone ?? null,
        Email: email ?? null,
        OtherBankId: otherBankId ?? null,
        OtherBranchId: otherBranchId ?? null,
      },
      { transaction }
    );

    //  Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction: newBeneficiary,
    });
  } catch (error) {
    console.error("Beneficiary Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Beneficiary Failed",
      error: error.message,
    });
  }
};

export const fetchAllBeneficiary = async (req, res) => {
  try {
    const { userId } = req.body;
    const allBeneficiary = await db.Beneficary.findAll({
      where: {
        UserId: userId,
        [Op.or]: [
          { IsDelete: 0 }, // Active records (0)
          { IsDelete: null }, // Records never deleted (NULL)
        ],
      },
    });
    res.status(200).json({
      message: "Beneficiary Retrieve successfully",
      data: allBeneficiary,
    });
  } catch (error) {
    console.error("Beneficiary", error);
    throw error;
  }
};

export const fetchOneBeneficiary = async (req, res) => {
  try {
    const { userId, nickname } = req.body;

    if (!userId || !nickname) {
      return res
        .status(400)
        .json({ message: "User ID and Nickname are required." });
    }

    const allBeneficiary = await db.Beneficary.findOne({
      where: {
        UserId: userId,
        NickName: nickname,
        [Op.or]: [{ IsDelete: 0 }, { IsDelete: null }],
      },
    });

    if (!allBeneficiary) {
      return res.status(400).json({ message: "Provided Nickname Not Found" });
    }

    const accountInfo = await db.CustomerAccount.findOne({
      where: {
        AccountNo: allBeneficiary.AccountNo,
      },
    });

    if (!accountInfo) {
      return res.status(400).json({ message: "Account Info Not Found" });
    }

    const accountType = await db.AccountTypes.findOne({
      where: {
        AccountId: accountInfo.AccountId,
      },
    });

    if (!accountType) {
      return res.status(400).json({ message: "Account Type Not Found" });
    }

    const returnBeneficiaryObj = {
      ...allBeneficiary.dataValues,
      AccountType: accountType.ProductName,
    };

    return res.status(200).json({
      message: "Beneficiary retrieved successfully",
      data: returnBeneficiaryObj,
    });
  } catch (error) {
    console.error("Error in fetchOneBeneficiary:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBeneficiary = async (req, res) => {
  try {
    const { id } = req.body;
    // Soft delete
    const result = await db.Beneficary.update(
      { IsDelete: 1 },
      { where: { Id: id } }
    );

    if (result === 0) {
      return res.status(404).json({ message: "Beneficary Not Found" });
    }

    res.status(200).json({
      message: "Beneficiary Deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Beneficiary", error);
    throw error;
  }
};
