import express from "express";
import {
  fetchAllTransactionHistory,
  exportCSV,
} from "../Controller/transferHistory.js";

const Router = express.Router();

Router.post("/fetchTranHistorys", fetchAllTransactionHistory);

Router.post("/exportCSV", exportCSV);
export default Router;
