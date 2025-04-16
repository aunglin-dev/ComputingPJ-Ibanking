import express from "express";
import { createBeneficiary } from "../Controller/beneficiary.js";

const Router = express.Router();

Router.post("/createBeneficiary", createBeneficiary);

export default Router;
