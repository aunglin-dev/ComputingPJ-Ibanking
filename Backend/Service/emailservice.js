import nodemailer from "nodemailer";

const emailtransporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "linoscar724@gmail.com",
    pass: "afxk qdzu xuap uind",
  },
  debug: true, // Enable debugging
  logger: true, // Log to the console
});

export default emailtransporter;
