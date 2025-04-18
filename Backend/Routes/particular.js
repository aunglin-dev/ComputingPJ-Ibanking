import express from "express";
import {
  getAllParticular,
  getOneParticular,
  updateTransactionLimit,
} from "../Controller/particular.js";

const Router = express.Router();

Router.get("/fetchParticular", getAllParticular);

Router.post("/fetchOneParticular", getOneParticular);

Router.put("/editParticular", updateTransactionLimit);

export default Router;
