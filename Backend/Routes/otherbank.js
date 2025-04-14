import express from "express";
import {
  fetchAllOtherBank,
  fetchOtherBranchesByOtherBankId,
  validateOtherBankTransfer,
  confirmOtherBankTransfer,
} from "../Controller/otherbank.js";

const Router = express.Router();

Router.get("/fetchAllOtherBank", fetchAllOtherBank);

Router.post(
  "/fetchOtherBranchesByOtherBankId",
  fetchOtherBranchesByOtherBankId
);

Router.post("/confirmOtherBankTransfer", confirmOtherBankTransfer);

Router.post("/", validateOtherBankTransfer);
export default Router;
