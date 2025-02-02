import express from "express";
import { signup, signin } from "../Controller/auth.js";

const Router = express.Router();

//User Register
Router.post("/signup", signup);

//User Login
Router.post("/signin", signin);

export default Router;
