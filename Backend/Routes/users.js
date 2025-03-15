import express from "express";
import {
  getAllUsers,
  signup,
  updateUser,
  requestUserAccount,
} from "../Controller/user.js";

const Router = express.Router();

//Get All Admins
Router.get("/getUsers", getAllUsers);

Router.post("/signup", signup);

Router.post("/requestUserAccount", requestUserAccount);

Router.put("/ApproveUser", updateUser);

export default Router;
