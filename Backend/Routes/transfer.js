import express from "express";
import {
  validateTransfer,
  confirmTransfer,
  fetchToAccNo,
} from "../Controller/transfer.js";
import {
  validateScheduleTransfer,
  confirmScheduleTransfer,
} from "../Controller/scheduleTransfer.js";

const Router = express.Router();

Router.post("/validateAllTransfer", validateTransfer);

Router.post("/confirmTransfer", confirmTransfer);

Router.post("/fetchToAccNo", fetchToAccNo);

Router.post("/validateScheduleTransfer", validateScheduleTransfer);

Router.post("/confirmScheduleTransfer", confirmScheduleTransfer);

export default Router;
