import { db } from "../config.js";

export const createAccountType = async (accDat, res) => {
  try {
    const { ProductName, CategoryGroup, MinimumBalance } = accDat.body;

    console.log(accDat.body);

    if (!ProductName || !CategoryGroup || MinimumBalance === undefined) {
      return res.status(400).json({
        message: "ProductName, CategoryGroup, and MinimumBalance are required",
      });
    }

    // Create new AccountType
    const newAcc = await db.AccountTypes.create({
      ProductName,
      CategoryGroup,
      MinimumBalance,
    });
    console.log(newAcc);
    res.status(201).json({
      message: "Account Types created successfully",
      admin: newAcc,
    });
    return newAcc;
  } catch (error) {
    throw new Error(error.message);
  }
};
