import { db, sequelize, Op } from "../config.js";

export const getAllParticular = async (req, res) => {
  try {
    const accounts = await db.Particular.findAll();

    const returnedObj = [];
    for (const account of accounts) {
      let officAccount = await db.Particular.findOne({
        where: {
          Id: account.OfficeAccountId,
        },
      });

      let tempObj = {
        TranType: account.TranType,
        OfficeAccountNumber:
          officAccount === null ? null : officAccount.OfficeAccountNumber,
        ChargesRate: account.ChargesRate,
      };

      returnedObj.push(tempObj);
    }

    res.status(200).json({
      message: "Particular Retrieve successfully",
      data: returnedObj,
    });
  } catch (error) {
    console.error("Error Particular:", error);
    throw error;
  }
};

export const getOneParticular = async (req, res) => {
  try {
    const account = await db.Particular.findOne({
      where: {
        Id: req.body.Id,
      },
    });

    let officAccount = await db.Particular.findOne({
      where: {
        Id: account.OfficeAccountId,
      },
    });

    let returnedObj = {
      TranType: account.TranType,
      OfficeAccountNumber:
        officAccount === null ? null : officAccount.OfficeAccountNumber,
      ChargesRate: account.ChargesRate,
    };

    res.status(200).json({
      message: "SpecificParticular Retrieve successfully",
      data: returnedObj,
    });
  } catch (error) {
    console.error("Error Particular:", error);
    throw error;
  }
};

export const updateTransactionLimit = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { particularId, chargesRate, officeAccountId, adminId } = req.body;

    //Check TranslimitId is not null
    if (!officeAccountId || !particularId) {
      return res.status(400).json({ message: "officeAccountId is required" });
    }

    //Check Valid OfficeAccount

    const isValidOfficeAccount = await db.OfficeAccounts.findOne({
      where: {
        Id: officeAccountId,
      },
      transaction,
    });

    if (!isValidOfficeAccount) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Office Account Not Found`,
      });
    }

    // Update Transaction Limit
    const result = await db.Particular.update(
      {
        OfficeAccountId: officeAccountId,
        ChargesRate: chargesRate,
        UpdateAdminId: adminId,
      },
      {
        where: { Id: particularId },
        transaction,
      }
    );

    console.log(result);

    //Check Affected Rows
    if (result.length < 0) {
      return res
        .status(404)
        .json({ message: "Particular table not found or no changes made" });
    }

    //  Commit transaction
    await transaction.commit();

    res.status(200).json({
      message: "Particular updated successfully",
    });
  } catch (error) {
    console.error("Error updating Particular:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
