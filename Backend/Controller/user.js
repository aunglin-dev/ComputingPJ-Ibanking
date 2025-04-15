import { db } from "../config.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { where } from "sequelize";
import emailtransporter from "../Service/emailservice.js";

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

export const requestUserAccount = async (req, res, next) => {
  try {
    // Destructure request body
    const {
      username,
      fullName,
      NRC,
      dateOfBirth,
      phoneNumber,
      email,
      address,
      gender,
      accountType,
    } = req.body;

    // Validate required fields
    if (
      !username ||
      !fullName ||
      !NRC ||
      !dateOfBirth ||
      !phoneNumber ||
      !accountType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find account types based on product names
    const accountResArray = await Promise.all(
      accountType.map(async (productName) => {
        const account = await db.AccountTypes.findOne({
          where: { ProductName: productName },
        });
        if (!account) {
          throw new Error(`Account type not found: ${productName}`);
        }
        return account;
      })
    );

    // Create a new user
    const newUser = await db.User.create({
      UserName: username,
      FullName: fullName,
      NRC,
      DateOfBirth: dateOfBirth,
      PhoneNumber: phoneNumber,
      Email: email,
      Address: address,
      CIFID: "12932",
      Gender: gender,
      UserType: "Requested",
    });

    await Promise.all(
      accountResArray.map(async (account) => {
        await db.CustomerAccount.create({
          UserId: newUser.UserId,
          Currency: "MMK",
          AccountId: account.AccountId,
          AccountNo: generateAccountNumber(),
        });
      })
    );

    res.status(201).json({
      message: "User account requested successfully",
      userId: newUser.UserId,
    });
  } catch (error) {
    console.error("Error requesting user account:", error);

    res.status(500).json({
      message: "Failed to request user account",
      error: error.message,
    });
  }
};

// Helper function to generate a unique account number
const generateAccountNumber = () => {
  return `10000${Math.floor(1000000000 + Math.random() * 9000000000)}`;
};

//   try {
//     const { UserId, UserType } = req.body;

//     const user = await db.User.findOne({
//       where: { UserId },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update the user's UserType
//     const updatedUser = await db.User.update(
//       { UserType },
//       {
//         where: {
//           UserId: UserId,
//         },
//       }
//     );

//     // Create a transporter for sending the email
//     const transporter = nodemailer.createTransport({
//       port: 465,
//       host: "smtp.gmail.com",

//       secure: true,
//       auth: {
//         user: "linoscar724@gmail.com",
//         pass: "gdurhmxizwxkjlra",
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: "zakiayayacoob@gmail.com",
//       to: "aunglin2252003@gmail.com",
//       subject: "UserType Update Notification",
//       text: `Dear ${user.FullName},\n\nYour account's UserType has been updated to: ${UserType}.\n\nIf you did not request this update, please contact support.`,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     // Respond back with success message
//     res.status(200).json({
//       message: "User updated successfully and email sent",
//       user: updatedUser,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

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
      { UserType, Password: generatePassword(), IsFirstTimeLogin: 1 },
      {
        where: {
          UserId: UserId,
        },
      }
    );

    const userSec = await db.User.findOne({
      where: { UserId },
    });
    console.log("Updated User", updatedUser);

    // Create a transporter for sending the email
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "linoscar724@gmail.com", // Your Gmail address
    //     pass: "afxk qdzu xuap uind", // Your Gmail app password
    //   },
    //   debug: true, // Enable debugging
    //   logger: true, // Log to the console
    // });

    // Email options
    const mailOptions = {
      from: "linoscar724@gmail.com", // Must match the email in `auth.user`
      to: "aunglin2252003@gmail.com", // Valid recipient email
      subject: "UserType Update Notification",
      text: `Dear ${user.FullName},\n\nYour account's UserType has been updated to: ${UserType} .\n\nIf you did not request this update, please contact support.\n\n You Can Now Login Into SMED Bank Internet Banking System \n\n By User Name : ${user.UserName} \n\n Temporary Password : ${userSec.Password} `,
    };

    // Send the email
    try {
      await emailtransporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ message: "Failed to send email", error: error.message });
    }

    // Respond back with success message
    res.status(200).json({
      message: "User updated successfully and email sent",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const generatePassword = (length = 12) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};
