import express from "express";
import { signup, signin, changePassword } from "../Controller/auth.js";

const Router = express.Router();

//User Register
Router.post("/signup", signup);

//User Login
Router.post("/signin", signin);

Router.post("/changepassword", changePassword);

export default Router;
