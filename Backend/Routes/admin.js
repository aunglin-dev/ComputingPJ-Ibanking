import express from "express";
import { getAllAdmins, createAdmin, Adminsignin } from "../Controller/admin.js";

const Router = express.Router();

//Get All Admins
Router.get("/getAdmin", getAllAdmins);

Router.post("/createAdmin", createAdmin);

Router.post("/adminSigin", Adminsignin);

export default Router;
