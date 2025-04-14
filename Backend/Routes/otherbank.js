import express from "express";
import {
  fetchAllOtherBank,
  fetchOtherBranchesByOtherBankId,
} from "../Controller/otherbank.js";

const Router = express.Router();

Router.get("/fetchAllOtherBank", fetchAllOtherBank);

Router.post(
  "/fetchOtherBranchesByOtherBankId",
  fetchOtherBranchesByOtherBankId
);

export default Router;
