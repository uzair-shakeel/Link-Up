import Story from "../models/storyModel.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import Relationship from "../models/relationshipModel.js";
import mongoose from "mongoose";

export const getStories = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    // Get the IDs of users followed by the current user
    const followedUserIds = await Relationship.distinct("followedUserId", {
      followerUserId: userInfo.id,
    });
    const objectId = new mongoose.Types.ObjectId(userInfo.id);

    // Include the current user's ID in the list of followed user IDs
    followedUserIds.push(objectId);

    // Query for stories that match the user IDs and are within the last day
    const stories = await Story.aggregate([
      {
        $match: {
          $or: [
            { userId: { $in: followedUserIds } }, // Stories from followed users
            { userId: objectId }, // Your own stories
          ],
          createdAt: { $gte: moment().subtract(1, "day").toDate() },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    return res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addStory = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newStory = new Story({
      img: req.body.img,
      createdAt: moment().toDate(),
      userId: userInfo.id,
      name: req.body.name,
    });

    await newStory.save();
    return res.status(200).json("Story has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const deletedStory = await Story.findOneAndDelete({
      _id: req.params.id,
      userId: userInfo.id,
    });

    if (deletedStory) {
      return res.status(200).json("Story has been deleted.");
    } else {
      return res.status(403).json("You can delete only your story!");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
