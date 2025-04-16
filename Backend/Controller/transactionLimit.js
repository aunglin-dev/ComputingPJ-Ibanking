import { where } from "sequelize";
import { db, sequelize, Op } from "../config.js";
import { tranType } from "../Utils/TranType.js";

export const createTransactionLimit = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      adminId,
      limitCode,
      currency,
      limitType,
      minAmount,
      maxAmount,
      rate,
      description,
    } = req.body;

    // Validate input
    if (!limitCode || !minAmount || !maxAmount || !rate) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    //Check MinAmt > MaxAMount
    if (minAmount >= maxAmount) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Min Amount Cannot be greater than MaxAMount" });
    }

    //Check MinAmount And MaxAmount Range

    const isRangeAlreadyDefined = await db.TrasnsactionLimit.findOne({
      where: {
        Currency: currency,

        [Op.and]: [
          { MinTransactionAmount: { [Op.lte]: maxAmount } },
          { MaxTransactionAmount: { [Op.gte]: minAmount } },
        ],
        [Op.or]: [
          { IsDelete: 0 }, // Active records (0)
          { IsDelete: null }, // Records never deleted (NULL)
        ],
      },
      transaction,
    });

    if (isRangeAlreadyDefined) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Transaction limit range (${minAmount}-${maxAmount}) already exists`,
      });
    }

    //Check Duplicate Limit Code

    const isDuplicateLimitCode = await db.TrasnsactionLimit.findAll({
      where: {
        LimitCode: limitCode,

        [Op.or]: [
          { IsDelete: 0 }, // Active records (0)
          { IsDelete: null }, // Records never deleted (NULL)
        ],
      },
      transaction,
    });

    if (isDuplicateLimitCode.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Duplicate Limit Code`,
      });
    }

    //Insert a row
    const newTransactionLimit = await db.TrasnsactionLimit.create(
      {
        LimitCode: limitCode,
        Currency: currency,
        LimitCodeDesc: description,
        MinTransactionAmount: minAmount,
        MaxTransactionAmount: maxAmount,
        LimitType: limitType,
        Rate: rate,
        CreatedDate: new Date(),
        CreatedUserId: adminId,
      },
      { transaction }
    );

    //  Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Trasaction Limit Added  successfully",
      transaction: newTransactionLimit,
    });
  } catch (error) {
    console.error("Trasaction Limi Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Trasaction Limi Failed",
      error: error.message,
    });
  }
};

export const fetchAllTransactionLimits = async (req, res) => {
  try {
    const allBeneficiary = await db.TrasnsactionLimit.findAll({
      where: {
        [Op.or]: [
          { IsDelete: 0 }, // Active records (0)
          { IsDelete: null }, // Records never deleted (NULL)
        ],
      },
    });
    res.status(200).json({
      message: "TransactionLimit Retrieve successfully",
      data: allBeneficiary,
    });
  } catch (error) {
    console.error("TransactionLimit", error);
    throw error;
  }
};
