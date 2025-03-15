import express from "express";
import {
  createAccountType,
  getAllAccountTypes,
} from "../Controller/accountTypes.js";

const Router = express.Router();

Router.post("/createAccountType", createAccountType);

Router.get("/getAccountType", getAllAccountTypes);

export default Router;
