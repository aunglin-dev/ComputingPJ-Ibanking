import express from "express";
import {
  getTransferSummaryByTranType,
  fetchAllTransferLogs,
  fetchAllUserTypes,
} from "../Controller/dashboard.js";

const Router = express.Router();

Router.get("/getTransferSummaryByTranType", getTransferSummaryByTranType);

Router.get("/fetchAllTransferLogs", fetchAllTransferLogs);

Router.get("/fetchAllUserTypes", fetchAllUserTypes);

export default Router;
