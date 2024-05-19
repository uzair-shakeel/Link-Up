// jobRoutes.js - JobsRoutes

import express from "express";
import {
  getJobs,
  addJob,
  deleteJob,
  getAllJobs,
  getAllClosedJobs,
  getAllOpenJobs,
  updateJobStatus,
  updateJob,
  getJobsByUser,
  applyForJob,
  getJobApplications,
} from "../controllers/jobs.js";
import upload from "../middleware/uploadMiddleware.js"; // Import the upload middleware

const router = express.Router();

router.get("/", getAllJobs);
router.get("/open", getAllOpenJobs);
router.get("/closed", getAllClosedJobs);
// router.get("/", getJobs);
router.get("/user/:userId", getJobsByUser);
router.post("/", addJob);
router.delete("/:id", deleteJob);
router.put("/status/:jobId", updateJobStatus);
router.put("/:jobId", updateJob);
router.post("/:jobId/apply", upload.single("cv"), applyForJob);
router.get("/:jobId/applications", getJobApplications);

export default router;
