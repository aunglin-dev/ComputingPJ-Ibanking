import express from "express";
import {
  validateTransfer,
  confirmTransfer,
  fetchToAccNo,
} from "../Controller/transfer.js";

const Router = express.Router();

Router.post("/validateAllTransfer", validateTransfer);

Router.post("/confirmTransfer", confirmTransfer);

Router.post("/fetchToAccNo", fetchToAccNo);

export default Router;
