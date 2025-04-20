import express from "express";
import {
  fetchfromAccNo,
  fetchfromAccNoTypeBalance,
} from "../Controller/customerAccount.js";

const Router = express.Router();

Router.post("/fetchfromAccNo", fetchfromAccNo);

Router.post("/fetchFromAccountInfo", fetchfromAccNoTypeBalance);

export default Router;
