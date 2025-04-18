import { db, sequelize, Op } from "../config.js";

export const getAllParticular = async (req, res) => {
  try {
    const accounts = await db.Particular.findAll();

    const returnedObj = [];
    for (const account of accounts) {
      let officeAccount = await db.OfficeAccounts.findOne({
        where: {
          Id: account.OfficeAccountId,
        },
      });

      let tempObj = {
        Id: account.Id,
        OfficeAccountId: account.OfficeAccountId,
        TranType: account.TranType,
        OfficeAccountNumber:
          officeAccount === null ? null : officeAccount.OfficeAccountNumber,
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

    let officAccount = await db.OfficeAccounts.findOne({
      where: {
        Id: account.OfficeAccountId,
      },
    });

    let returnedObj = {
      TranType: account.TranType,
      OfficeAccountId: account.OfficeAccountId,
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

export const getAllOfficeAccount = async (req, res) => {
  try {
    let officeAccounts = await db.OfficeAccounts.findAll();

    if (!officeAccounts) {
      return res
        .status(400)
        .json({ message: "officeAccount Not Fount is required" });
    }

    res.status(200).json({
      message: "Particular Retrieve successfully",
      data: officeAccounts,
    });
  } catch (error) {
    console.error("Error Particular:", error);
    throw error;
  }
};
