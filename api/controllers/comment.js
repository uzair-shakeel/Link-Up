import Comment from "../models/commentModel.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.query.postId })
      .populate("userId", "id name profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newComment = new Comment({
      desc: req.body.desc,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      userId: userInfo.id,
      postId: req.body.postId,
    });

    await newComment.save();
    return res.status(200).json("Comment has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      userId: userInfo.id,
    });

    if (deletedComment) {
      return res.json("Comment has been deleted!");
    } else {
      return res.status(403).json("You can delete only your comment!");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
