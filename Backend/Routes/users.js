import express from "express";
import { getAllUsers, signup, updateUser } from "../Controller/user.js";

const Router = express.Router();

//Get All Admins
Router.get("/getUsers", getAllUsers);

Router.post("/signup", signup);

Router.put("/ApproveUser", updateUser);



export default Router;
