import { where } from "sequelize";
import { db } from "../config.js";

export const fetchAllOtherBank = async (req, res) => {
  try {
    const resOtherBank = await db.OtherBank.findAll();

    console.log(res);
    res.status(200).json(resOtherBank);
  } catch (error) {
    console.error("Error fetching otherbanks:", error);
    throw error;
  }
};

export const fetchOtherBranchesByOtherBankId = async (req, res) => {
  try {
    const { BankId } = req.body;
    const resOtherBranches = await db.OtherBranches.findAll({
      where: { BankId },
    });

    if (resOtherBranches.length < 1) {
      res.status(201).json({ message: "No Data For this BankId" });
    }

    res.status(200).json(resOtherBranches);
  } catch (error) {
    console.error("Error fetching otherbanks:", error);
    throw error;
  }
};
