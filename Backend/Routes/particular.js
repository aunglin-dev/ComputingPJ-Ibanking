import express from "express";
import {
  getAllParticular,
  getOneParticular,
  updateTransactionLimit,
  getAllOfficeAccount,
} from "../Controller/particular.js";

const Router = express.Router();

Router.get("/fetchParticular", getAllParticular);

Router.post("/fetchOneParticular", getOneParticular);

Router.get("/fetchOfficeAccounts", getAllOfficeAccount);

Router.put("/editParticular", updateTransactionLimit);

export default Router;
