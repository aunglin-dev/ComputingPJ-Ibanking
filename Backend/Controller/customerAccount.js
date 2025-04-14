import { db } from "../config.js";

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
