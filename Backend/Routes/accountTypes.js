import express from "express";
import { createAccountType } from "../Controller/accountTypes.js";

const Router = express.Router();

Router.post("/createAccountType", createAccountType);

export default Router;
