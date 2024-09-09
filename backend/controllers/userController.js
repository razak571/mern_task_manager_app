import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const signupUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!userModel || !firstname || !lastname || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res.status(400).send("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    generateToken(res, newUser._id);
    res.status(201).json({
      success: true,
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      generateToken(res, existingUser._id);
      res.status(200).json({
        _id: existingUser._id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export { signupUser, loginUser, logoutUser };
