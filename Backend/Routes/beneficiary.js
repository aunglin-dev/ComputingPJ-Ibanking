import express from "express";
import {
  createBeneficiary,
  fetchAllBeneficiary,
  fetchOneBeneficiary,
} from "../Controller/beneficiary.js";

const Router = express.Router();

Router.post("/createBeneficiary", createBeneficiary);

Router.post("/fetchAllBeneficiary", fetchAllBeneficiary);

Router.post("/fetchOneBeneficiary", fetchOneBeneficiary);

export default Router;
