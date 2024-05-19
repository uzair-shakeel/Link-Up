import Like from "../models/likeModel.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.query.postId }, "userId");
    const userIds = likes.map((like) => like.userId);
    return res.status(200).json(userIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newLike = new Like({
      userId: userInfo.id,
      postId: req.body.postId,
    });

    await newLike.save();
    return res.status(200).json("Post has been liked.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deleteLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const deletedLike = await Like.findOneAndDelete({
      userId: userInfo.id,
      postId: req.query.postId,
    });

    if (deletedLike) {
      return res.status(200).json("Post has been disliked.");
    } else {
      return res.status(404).json("No like found to delete.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
