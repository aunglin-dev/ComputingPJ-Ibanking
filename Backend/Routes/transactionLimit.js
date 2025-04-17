import express from "express";
import {
  createTransactionLimit,
  fetchAllTransactionLimits,
  deleteTransactionLimit,
  updateTransactionLimit,
  fetchOneTransactionLimit,
} from "../Controller/transactionLimit.js";

const Router = express.Router();

Router.post("/createTransactionLimit", createTransactionLimit);

Router.post("/detail", fetchOneTransactionLimit);

Router.get("/fetchAllTransactionLimits", fetchAllTransactionLimits);

Router.put("/deleteTransactionLimit", deleteTransactionLimit);

Router.put("/updateTransactionLimit", updateTransactionLimit);

export default Router;
