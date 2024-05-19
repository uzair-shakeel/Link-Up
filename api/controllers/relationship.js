import Relationship from "../models/relationshipModel.js";
import jwt from "jsonwebtoken";

export const getRelationships = async (req, res) => {
  try {
    const relationships = await Relationship.find({ followedUserId: req.query.followedUserId });
    const followerUserIds = relationships.map(relationship => relationship.followerUserId);
    return res.status(200).json(followerUserIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addRelationship = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newRelationship = new Relationship({
      followerUserId: userInfo.id,
      followedUserId: req.body.userId
    });

    await newRelationship.save();
    return res.status(200).json("Following");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deleteRelationship = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const deletedRelationship = await Relationship.findOneAndDelete({
      followerUserId: userInfo.id,
      followedUserId: req.query.userId
    });

    if (deletedRelationship) {
      return res.status(200).json("Unfollow");
    } else {
      return res.status(500).json("Failed to unfollow");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getFollowings = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const followings = await Relationship.find({ followerUserId: userInfo.id })
      .populate({ path: "followedUserId", select: "id name profilePic online" })
      .sort({ name: 1 });

    if (!followings) {
      // If the user has no followings, return an empty array
      return res.status(200).json([]);
    }

    return res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getFollowers = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const followers = await Relationship.find({ followedUserId: userInfo.id })
      .populate({ path: "followerUserId", select: "id name profilePic online" })
      .sort({ name: 1 });

    if (!followers) {
      // If the user has no followers, return an empty array
      return res.status(200).json([]);
    }


    return res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

