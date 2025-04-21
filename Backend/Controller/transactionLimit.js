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

      description,
    } = req.body;

    // Validate input
    if (!limitCode || !minAmount || !maxAmount) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Minimum Amount", minAmount, "Maximum Account", maxAmount);
    //Check MinAmt > MaxAMount
    if (minAmount > maxAmount) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Min Amount Cannot be greater than MaxAMount" });
    }

    //Check MinAmount And MaxAmount Range

    const isRangeAlreadyDefined = await db.TransactionLimit.findOne({
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

    const isDuplicateLimitCode = await db.TransactionLimit.findAll({
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
    const newTransactionLimit = await db.TransactionLimit.create(
      {
        LimitCode: limitCode,
        Currency: currency,
        LimitCodeDesc: description,
        MinTransactionAmount: minAmount,
        MaxTransactionAmount: maxAmount,
        LimitType: limitType,
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
    const allBeneficiary = await db.TransactionLimit.findAll({
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

export const fetchOneTransactionLimit = async (req, res) => {
  try {
    const { translimitId } = req.body;
    const transactionLimit = await db.TransactionLimit.findOne({
      where: {
        Id: translimitId,
        [Op.or]: [{ IsDelete: 0 }, { IsDelete: null }],
      },
    });

    if (!transactionLimit) {
      return res
        .status(404)
        .json({ message: "The Specific Transaction Limit has not found " });
    }
    res.status(200).json({
      message: "TransactionLimit Retrieve successfully",
      data: transactionLimit,
    });
  } catch (error) {
    console.error("TransactionLimit", error);
    throw error;
  }
};

export const updateTransactionLimit = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { translimitId, ...body } = req.body;
    console.log(translimitId, body);

    //Check TranslimitId is not null
    if (!translimitId) {
      return res.status(400).json({ message: "translimitId is required" });
    }

    //Check Required Field
    if (Object.keys(body).length === 0 || !body.minAmount || !body.maxAmount) {
      return res.status(400).json({ message: "No fields to update" });
    }

    //Check MinAmt > MaxAMount
    if (body.minAmount >= body.maxAmount) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Min Amount Cannot be greater than MaxAMount" });
    }

    //Check MinAmount And MaxAmount Range

    const isRangeAlreadyDefined = await db.TransactionLimit.findOne({
      where: {
        Currency: body.currency,
        Id: { [Op.ne]: translimitId },
        [Op.and]: [
          { MinTransactionAmount: { [Op.lte]: body.maxAmount } },
          { MaxTransactionAmount: { [Op.gte]: body.minAmount } },
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
        message: `Transaction limit range (${body.minAmount}-${body.maxAmount}) already exists`,
      });
    }

    // Update Transaction Limit
    const result = await db.TransactionLimit.update(
      {
        Currency: body.currency,
        MinTransactionAmount: body.minAmount,
        MaxTransactionAmount: body.maxAmount,

        LimitCodeDesc: body.description,
        CreatedUserId: body.adminId,
        LimitType: body.limitType,
      },
      {
        where: { Id: translimitId },
        transaction,
      }
    );

    console.log(result);

    //Check Affected Rows
    if (result.length < 0) {
      return res
        .status(404)
        .json({ message: "Transaction limit not found or no changes made" });
    }

    // Return updated record
    const updatedRecord = await db.TransactionLimit.findOne({
      where: { Id: translimitId },
      transaction,
    });

    //  Commit transaction
    await transaction.commit();

    res.status(200).json({
      message: "TransactionLimit updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating TransactionLimit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTransactionLimit = async (req, res) => {
  try {
    const { translimitId } = req.body;

    // Soft delete
    const result = await db.TransactionLimit.update(
      { IsDelete: 1 },
      { where: { Id: translimitId } }
    );

    if (result === 0) {
      return res.status(404).json({ message: "Transaction limit not found" });
    }

    res.status(200).json({
      message: "TransactionLimit deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting TransactionLimit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
