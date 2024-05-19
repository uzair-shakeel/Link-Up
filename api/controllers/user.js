import User from "../models/userModel.js";
import Relationship from "../models/relationshipModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error: ", error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        city: req.body.city,
        website: req.body.website,
        profilePic: req.body.profilePic,
        coverPic: req.body.coverPic,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.json("Updated!");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
      return res.status(400).json("Search term is required");
    }
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
      ],
    });
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error: ", error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Find the IDs of followed users
    const followedUserIds = await Relationship.find({
      followerUserId: userId,
    }).distinct("followedUserId");

    // Find suggested users who are not followed by the current user
    let suggestedUsers = await User.aggregate([
      {
        $match: {
          $and: [{ _id: { $nin: followedUserIds } }, { _id: { $ne: userId } }],
        },
      }, // Exclude followed users and the current user
      { $sample: { size: 2 } }, // Retrieve a random sample of 2 users
    ]);

    return res.json(suggestedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const updateOnlineStatus = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const { online } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { online },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.json({ message: "Online status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getOnlineFollowedUsers = async (req, res) => {
  try {
    // Verify the user's token to get their ID
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    // Retrieve the user document from the database using their ID
    const userId = userInfo.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Extract the IDs of the users being followed by the current user
    const followedUserIds = await Relationship.find({
      followerUserId: userId,
    }).distinct("followedUserId");
    if (followedUserIds.length === 0) {
      // If the user is not following anyone, return an empty array
      return res.json([]);
    }

    // Query the database for online users who are being followed
    const onlineFollowedUsers = await User.find({
      _id: { $in: followedUserIds },
      online: true, // Only retrieve users who are online
    }).select("id name profilePic online");

    return res.json(onlineFollowedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword);
  res.send(users);

  if (!user) {
    res.send("user not found");
  }
});
