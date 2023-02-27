import bcrypt from "bcrypt"; // for hashing passwords
import jwt from "jsonwebtoken"; // for creating tokens
import User from "../models/User.js"; // for User model

// REGISTER USER 
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      location,
      occupation,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGGING IN 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
//checking if user exists
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });
//checking pass with salt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
//creating token, I wanna try auth 0  later
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//deleting  pass to make sure it does not end up in the frontend
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
