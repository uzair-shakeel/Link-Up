import express from "express";
import { getRelationships, addRelationship, deleteRelationship, getFollowings, getFollowers } from "../controllers/relationship.js";

const router = express.Router()

router.get("/", getRelationships)
router.get("/following", getFollowings)
router.get("/follower", getFollowers)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)


export default router