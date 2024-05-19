import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    // Check if user exists by username or email
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (existingUser) {
      return res.status(409).json("Username or email already exists!");
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    await newUser.save();
    return res.status(200).json("User has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Check password
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(400).json("Wrong password or username!");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "15d" });

    // Exclude password from response
    const { password, ...others } = user.toObject();

    // Set token in cookie and send user data
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        // Set maxAge to a value in milliseconds to specify the cookie's expiration time
        maxAge: 7 * 24 * 60 * 60 * 1000, // Example: 7 days
        // You can also set other cookie attributes as needed
        // secure: true, // Uncomment this line if using HTTPS
        // sameSite: "none", // Uncomment this line if cross-origin requests need to send cookies
      })
      .status(200)
      .json(others);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
