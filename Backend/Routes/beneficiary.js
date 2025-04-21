import express from "express";
import {
  createBeneficiary,
  fetchAllBeneficiary,
  fetchOneBeneficiary,
  deleteBeneficiary,
} from "../Controller/beneficiary.js";

const Router = express.Router();

Router.post("/createBeneficiary", createBeneficiary);

Router.post("/fetchAllBeneficiary", fetchAllBeneficiary);

Router.post("/fetchOneBeneficiary", fetchOneBeneficiary);

Router.put("/deleteBeneficiary", deleteBeneficiary);

export default Router;
