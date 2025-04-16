import { where } from "sequelize";
import { db, sequelize, Op } from "../config.js";
import { tranType } from "../Utils/TranType.js";

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
