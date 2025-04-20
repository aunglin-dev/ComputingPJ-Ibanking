import { db, sequelize } from "../config.js";
import { Where } from "sequelize/lib/utils";

export const fetchfromAccNo = async (req, res) => {
  const { UserId } = req.body;

  const resfromAccNoList = await db.CustomerAccount.findAll({
    where: { UserId: UserId },
  });

  console.log(resfromAccNoList);
  if (resfromAccNoList == null)
    return res.status(400).json({
      message: "No FromAccount",
    });

  res.status(200).json(resfromAccNoList);
};

export const fetchfromAccNoTypeBalance = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { UserId } = req.body;

    //Fetch From Account
    const resfromAccNoList = await db.CustomerAccount.findAll({
      where: { UserId: UserId },
      transaction,
    });

    //Balance

    const totalBalance = resfromAccNoList.reduce(
      (sum, el) => sum + el.Balance,
      0
    );

    console.log(resfromAccNoList);
    if (resfromAccNoList == null)
      return res.status(400).json({
        message: "No FromAccount",
      });

    const accountLookups = await Promise.all(
      resfromAccNoList.map((fromAccount) =>
        db.AccountTypes.findOne({
          where: { AccountId: fromAccount.AccountId },
          transaction,
        }).then((accountType) => {
          if (!accountType)
            res.status(400).json({
              message: "Account Type is Invalid",
            });

          return {
            ProductName: accountType.ProductName,
            Balance: fromAccount.Balance,
            FromAccountNo: fromAccount.AccountNo,
          };
        })
      )
    );

    const returnObj = { fromAccountInfo: accountLookups, totalBalance };

    res.status(200).json({
      message: "Data fetched successfully",
      data: returnObj,
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    return res.status(500).json({
      success: false,
      message: "Fetech From Accountfailed",
      error: error.message,
    });
  }
};
