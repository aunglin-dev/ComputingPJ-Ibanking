import AuthRouter from "./Routes/auth.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./Routes/admin.js";
import userRouter from "./Routes/users.js";
import accountTypeRouter from "./Routes/accountTypes.js";

const app = express();
const port = 8800;

import cookieParser from "cookie-parser";
// import { connect } from "../Backend/config.js";const { connect } = import("./db.js");
import { connect } from "./config.js";
import cors from "cors";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors());
app.use(express.json());

//Routers
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/accountTypes", accountTypeRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong.";

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

connect()
  .then((connection) => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Database connection failed!");
    console.log(error);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
