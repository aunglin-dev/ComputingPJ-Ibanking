import express from "express";
import {
  createSchemeCode,
  updateTransactionLimit,
  fetchAllSchemeCodes,
  deleteSchemeCode,
  fetchSchemeCode,
} from "../Controller/schemeCode.js";

const Router = express.Router();

Router.post("/createSchemeCode", createSchemeCode);

Router.post("/fetchSpecificSchemCode", fetchSchemeCode);

Router.post("/deleteSchemeCode", deleteSchemeCode);

Router.get("/fetchSchemeCode", fetchAllSchemeCodes);

Router.put("/updateSchemeCode", updateTransactionLimit);

export default Router;
