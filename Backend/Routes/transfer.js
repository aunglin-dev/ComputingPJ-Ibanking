import express from "express";
import { validateTransfer, confirmTransfer } from "../Controller/transfer.js";

const Router = express.Router();

Router.post("/validateAllTransfer", validateTransfer);

Router.post("/confirmTransfer", confirmTransfer);

export default Router;
