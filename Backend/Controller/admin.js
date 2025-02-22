import { db } from "../config.js";
import bcrypt from "bcryptjs";

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await db.Admin.findAll();

    res.status(200).json({
      message: "Admin Retrieve successfully",
      data: admins, // The admin data you want to return
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const createAdmin = async (adminData, res) => {
  try {
    console.log(adminData.body);
    const { Username, Password, FullName, Email, PhoneNumber, Role, Status } =
      adminData.body;

    // Check required fields
    if (!Username || !Password || !FullName || !Email || !Role) {
      throw new Error("Missing required fields");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create new admin
    const newAdmin = await db.Admin.create({
      Username,
      PasswordHash: hashedPassword,
      FullName,
      Email,
      PhoneNumber,
      Status,
      Role,
    });
    console.log(newAdmin);
    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
    return newAdmin;
  } catch (error) {
    throw new Error(error.message);
  }
};
