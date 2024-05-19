import express from "express";
import {
  getOnlineFollowedUsers,
  getSuggestedUsers,
  getUser,
  searchUsers,
  updateOnlineStatus,
  updateUser,
  allUsers,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.put("/online", updateOnlineStatus);
router.get("/search", searchUsers);
router.get("/suggestion", getSuggestedUsers);
router.get("/online-followed", getOnlineFollowedUsers);
router.get("/", allUsers);

export default router;
