import Post from "../models/postModel.js";
import jwt from "jsonwebtoken";
import Relationship from "../models/relationshipModel.js";
import moment from "moment";

export const getPosts = async (req, res) => {
  try {
    // Verify the user's token to get their ID
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    // Retrieve the user ID from the query parameters or use the user's ID from the token
    let userId = req.query.userId;
    if (userId === "undefined") userId = undefined; // Convert "undefined" string to actual undefined

    // Check if userId is undefined or matches the authenticated user's ID
    if (userId !== undefined) {
      // If userId is provided,
      // fetch only the posts of the specified user
      const posts = await Post.find({ userId })
        .populate("userId")
        .sort({ createdAt: -1 });
      return res.json(posts);
    } else {
      // If userId is undefined,
      // fetch posts of the authenticated user's followings
      const followedUserIds = await Relationship.find({
        followerUserId: userInfo.id,
      }).distinct("followedUserId");
      followedUserIds.push(userInfo.id); // Include the authenticated user's ID
      const posts = await Post.find({ userId: { $in: followedUserIds } })
        .populate("userId")
        .sort({ createdAt: -1 });
      return res.json(posts);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addPost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newPost = new Post({
      desc: req.body.desc,
      img: req.body.img,
      createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userId: userInfo.id,
    });

    await newPost.save();
    return res.status(200).json("Post has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: userInfo.id,
    });

    if (deletedPost) {
      return res.status(200).json("Post has been deleted.");
    } else {
      return res.status(403).json("You can delete only your post.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
