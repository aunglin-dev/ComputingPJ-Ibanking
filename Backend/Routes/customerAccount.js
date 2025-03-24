import express from "express";
import { fetchfromAccNo } from "../Controller/customerAccount.js";

const Router = express.Router();

Router.post("/fetchfromAccNo", fetchfromAccNo);

export default Router;
