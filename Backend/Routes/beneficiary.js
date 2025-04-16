import express from "express";
import {
  createBeneficiary,
  fetchAllBeneficiary,
} from "../Controller/beneficiary.js";

const Router = express.Router();

Router.post("/createBeneficiary", createBeneficiary);

Router.post("/fetchAllBeneficiary", fetchAllBeneficiary);

export default Router;
