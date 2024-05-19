// authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  try {
    // Decode token id
    const decoded = jwt.verify(token, "secretkey");
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
