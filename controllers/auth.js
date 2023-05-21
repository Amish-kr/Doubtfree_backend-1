import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import UserModel from "../models/auth.js";

export const signup = async (req, res) => {
  const { Nickname, email, password, residence, number, donation, website } =
    req.body;
  if (
    !Nickname ||
    !email | !password | !residence | !number | !donation | !website
  ) {
    return res.status(400).json({
      error: "Empty fields",
      message: {
        Nickname: "This field is required",
        email: "This field is required",
        password: "This field is required",
        residence: "This field is required",
        number: "This field is required",
        donation: "This field is required",
        website: "This field is required",
      },
    });
  }
  try {
    const existinguser = await UserModel.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const newUser = await UserModel.create({
        Nickname,
        email,
        password: hashedPassword,
        residence,
        number,
        donation,
        website,
      });
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ result: newUser, token });
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).json({ message: "Something went wrong..." });
    }
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email | !password) {
    return res.status(400).json({
      error: "Empty fields",
      message: {
        email: "This field is required",
        password: "This field is required",
      },
    });
  }
  try {
    const existinguser = await UserModel.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }

    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};
