import express from "express";
import { fetchAllTransactionHistory } from "../Controller/transferHistory.js";

const Router = express.Router();

Router.post("/fetchTranHistorys", fetchAllTransactionHistory);

export default Router;
