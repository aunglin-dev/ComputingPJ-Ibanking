import bcrypt from "bcryptjs";
import User from "../Model/User.js";
import { ErrorHandler } from "../Utils/error.js";
import Jwt from "jsonwebtoken";
import { db } from "../config.js";

//Registeration
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("Successfully User added");
  } catch (err) {
    next(err);
  }
};

const firstTimeLogin = (password1, password2) => {
  return password1 == password2 ? true : false;
};

//Login
export const signin = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log(email);
    //Find user from database
    const user = await db.User.findOne({ where: { email } });

    console.log(user);

    //Check Password
    console.log("First Time__________", user.IsFirstTimeLogin);

    const passwordCorrect =
      user === null
        ? false
        : user.IsFirstTimeLogin
        ? firstTimeLogin(req.body.password, user.Password)
        : await bcrypt.compare(req.body.password, user.Password);

    console.log(passwordCorrect);
    if (!(user && passwordCorrect))
      return next(ErrorHandler(400, "Invalid Username or Password"));

    if (user != null && passwordCorrect && user.IsFirstTimeLogin) {
      return res.status(201).json({
        status: "success",
        message: "First-time login detected",
        isFirstLogin: true,
        data: {
          userId: user.UserId,
        },
      });
    }

    // console.log("Something is wrong");
    //Create a token
    const Usertoken = { name: user.UserName, id: user.UserId };

    const token = Jwt.sign(Usertoken, process.env.SECRET);

    //Retrive data except password
    const { Password: _, ...other } = user.dataValues;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    // Password validation rules
    const minLength = 6;
    const maxLength = 10;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // Regex to check for at least one special character

    // Validate password length
    if (password.length < minLength || password.length > maxLength) {
      return res.status(400).json({
        message: `Password must be between ${minLength} and ${maxLength} characters long.`,
      });
    }

    // Validate special character
    if (!specialCharRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one special character.",
      });
    }

    // Find the user
    const user = await db.User.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Update the user's password and reset the first-time login flag
    const updatedUser = await db.User.update(
      { Password: hash, IsFirstTimeLogin: 0 },
      {
        where: {
          UserId: userId,
        },
      }
    );

    // Respond with success message
    res.status(200).json({
      message: "Successfully Changed Password",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
