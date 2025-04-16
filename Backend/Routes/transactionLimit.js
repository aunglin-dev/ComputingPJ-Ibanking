import express from "express";
import {
  createTransactionLimit,
  fetchAllTransactionLimits,
} from "../Controller/transactionLimit.js";

const Router = express.Router();

Router.post("/createTransactionLimit", createTransactionLimit);

Router.get("/fetchAllTransactionLimits", fetchAllTransactionLimits);

export default Router;
