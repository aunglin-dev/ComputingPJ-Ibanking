import { where } from "sequelize";
import { db, sequelize, Op } from "../config.js";
import { tranType } from "../Utils/TranType.js";
import SchemeCode from "../Model/SchemeCode.js";

export const createSchemeCode = async (req, res) => {
  const { schemeCode, accountLimitArr, adminId } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Validate input
    if (
      !schemeCode ||
      !Array.isArray(accountLimitArr) ||
      accountLimitArr.length === 0
    ) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Scheme code and account limit array are required" });
    }

    //Check Duplicate SchemeCode
    const duplicateSchemeCode = await db.SchemeCode.findOne({
      where: {
        SchemeCode: schemeCode,
      },
      transaction,
    });

    if (duplicateSchemeCode) {
      return res.status(400).json({
        message: `Duplicate entry already exists for SchemeCode: ${schemeCode} `,
      });
    }

    // Validate each item in array
    for (const item of accountLimitArr) {
      if (!item.accountId || !item.transLimitId) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Each account must have both accountId and transLimitId",
        });
      }

      //CheckDuplicte AccountId
      const accountIds = accountLimitArr.map((item) => item.accountId);
      const hasDuplicates = new Set(accountIds).size !== accountIds.length;

      if (hasDuplicates) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Duplicate AccountId detected in provided Array. Each account type must be unique.",
        });
      }

      //Check accountId is valid

      const [allaccountIds, limitCodes] = await Promise.all([
        db.AccountTypes.findOne({
          where: { AccountId: item.accountId },
          transaction,
        }),
        db.TransactionLimit.findOne({
          where: { LimitCode: item.transactionLimit },
          transaction,
        }),
      ]);

      if (!allaccountIds || !limitCodes) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Invalid accountId  or limit Code" });
      }
    }

    // Bulk insert all valid records
    const schemeCodeRecords = accountLimitArr.map((item) => ({
      SchemeCode: schemeCode,
      AccountId: item.accountId,
      LimitCodeId: item.transLimitId,
      LimitCode: item.transactionLimit || null,
      AccountType: item.accountType || null,
      CreatedAdminId: adminId || null,
    }));

    await db.SchemeCode.bulkCreate(schemeCodeRecords, { transaction });

    console.log(schemeCodeRecords);

    await transaction.commit();

    return res
      .status(200)
      .json({ message: "Scheme codes inserted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error inserting scheme code records:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchAllSchemeCodes = async (req, res) => {
  try {
    const fetchSchemeCodes = await db.SchemeCode.findAll({
      attributes: ["SchemeCode"],
      group: ["SchemeCode"],
    });
    res.status(200).json({
      message: "All SchemeCodes Retrieve successfully",
      data: fetchSchemeCodes,
    });
  } catch (err) {
    console.error("TransactionLimit", error);
    throw err;
  }
};

export const fetchSchemeCode = async (req, res) => {
  try {
    const { schemeCode } = req.body;

    const fetchedSchemeCode = await db.SchemeCode.findAll({
      where: {
        SchemeCode: schemeCode,
      },
    });

    if (!fetchedSchemeCode) {
      return res
        .status(404)
        .json({ message: "The Specific Scheme Code  has not found " });
    }
    res.status(200).json({
      message: "All SchemeCodes Retrieve successfully",
      data: fetchedSchemeCode,
    });
  } catch (err) {
    console.error("TransactionLimit", error);
    throw err;
  }
};

export const deleteSchemeCode = async (req, res) => {
  try {
    const { schemeCode } = req.body;

    // hard delete
    const result = await db.SchemeCode.destroy({
      where: { SchemeCode: schemeCode },
    });

    if (result === 0) {
      return res.status(404).json({ message: "Scheme Code not found" });
    }

    res.status(200).json({
      message: "SchemeCode deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting TransactionLimit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTransactionLimit = async (req, res) => {
  const { schemeCode, accountLimitArr } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Basic validation
    if (
      !schemeCode ||
      !Array.isArray(accountLimitArr) ||
      accountLimitArr.length === 0
    ) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Scheme code and account limit array are required" });
    }

    // Get current records from DB for this schemeCode
    const existingRecords = await db.SchemeCode.findAll({
      where: { SchemeCode: schemeCode },
      transaction,
    });

    const incomingIds = accountLimitArr
      .map((item) => item.id)
      .filter((id) => id); // only ids from incoming payload

    const existingIds = existingRecords.map((record) => record.Id);

    // Separate records
    const toUpdate = accountLimitArr.filter(
      (item) => item.id && existingIds.includes(item.id)
    );

    const toInsert = accountLimitArr.filter((item) => !item.id);

    const toDelete = existingRecords.filter(
      (record) => !incomingIds.includes(record.Id)
    );

    // INSERT new records
    for (const item of toInsert) {
      const { accountId, transLimitId, limitCode, accountType, adminId } = item;

      if (!accountId || !transLimitId) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "All Account Type and TransLimit cannot be null (for new records)",
        });
      }

      await db.SchemeCode.create(
        {
          AccountId: accountId,
          LimitCodeId: transLimitId,
          LimitCode: limitCode || null,
          AccountType: accountType || null,
          CreatedAdminId: adminId || null,
          SchemeCode: schemeCode,
        },
        { transaction }
      );
    }

    // UPDATE existing records
    for (const item of toUpdate) {
      const { id, accountId, transLimitId, limitCode, accountType, adminId } =
        item;

      if (!id || !accountId || !transLimitId) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Each update item must include id, accountId and transLimitId",
        });
      }

      const [updatedCount] = await db.SchemeCode.update(
        {
          AccountId: accountId,
          LimitCodeId: transLimitId,
          LimitCode: limitCode || null,
          AccountType: accountType || null,
          CreatedAdminId: adminId || null,
          SchemeCode: schemeCode,
        },
        {
          where: { Id: id },
          transaction,
        }
      );

      if (updatedCount === 0) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: `No record found with Id ${id}` });
      }
    }

    // DELETE records that are no longer included
    for (const record of toDelete) {
      await db.SchemeCode.destroy({
        where: { Id: record.Id },
        transaction,
      });
    }

    // Finalize
    await transaction.commit();
    return res
      .status(200)
      .json({ message: "Scheme code records updated successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error("Error during update:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
