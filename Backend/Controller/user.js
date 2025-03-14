import { db } from "../config.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();

    res.status(200).json({
      message: "Users Retrieve successfully",
      data: users, // The admin data you want to return
    });
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};

export const signup = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(req.body.Password, salt);

    const dateOfBirth = new Date(req.body.DateOfBirth);

    console.log(req.body);
    const newUser = await db.User.create({
      ...req.body,
      password: hash,
      DateOfBirth: dateOfBirth,
    });

    console.log("New User", newUser);
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { UserId, UserType } = req.body;

    
    const user = await db.User.findOne({
      where: { UserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's UserType
    const updatedUser = await db.User.update(
      { UserType },
      {
        where: {
          UserId: UserId,
        },
      }
    );

    // Create a transporter for sending the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      host: "smtp.gmail.com",

      secure: true, 
      auth: {
        user: "zakiayayacoob@gmail.com", 
        pass: "qdmj hvyc okrn bphv", 
      },
    });

    // Email options
    const mailOptions = {
      from: "zakiayayacoob@gmail.com",
      to: user.Email,
      subject: "UserType Update Notification",
      text: `Dear ${user.FullName},\n\nYour account's UserType has been updated to: ${UserType}.\n\nIf you did not request this update, please contact support.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond back with success message
    res.status(200).json({
      message: "User updated successfully and email sent",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
