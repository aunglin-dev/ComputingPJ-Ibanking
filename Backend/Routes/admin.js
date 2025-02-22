import express from "express";
import { getAllAdmins, createAdmin } from "../Controller/admin.js";

const Router = express.Router();

//Get All Admins
Router.get("/getAdmin", getAllAdmins);

Router.post("/createAdmin", createAdmin);

export default Router;
