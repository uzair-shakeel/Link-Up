import Job from "../models/jobModel.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("userId").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller to get all open jobs
export const getAllOpenJobs = async (req, res) => {
  try {
    const openJobs = await Job.find({ status: "open" })
      .populate("userId")
      .sort({ createdAt: -1 });
    res.json(openJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller to get all closed jobs
export const getAllClosedJobs = async (req, res) => {
  try {
    const closedJobs = await Job.find({ status: "closed" })
      .populate("userId")
      .sort({ createdAt: -1 });
    res.json(closedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const jobs = await Job.find({ userId: userInfo.id }).sort({
      createdAt: -1,
    });

    return res.json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Controller to get jobs of a specific user
export const getJobsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all jobs created by the specific user
    const jobs = await Job.find({ createdBy: userId });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addJob = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    console.log(token);
    if (!token) return res.status(401).json("Not logged in!");
    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newJob = new Job({
      title: req.body.title,
      description: req.body.description,
      company: req.body.company,
      location: req.body.location,
      status: req.body.status,
      budget: req.body.budget,
      duration: req.body.duration,
      experience: req.body.experience,
      img: req.body.img,
      createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userId: userInfo.id,
    });

    await newJob.save();
    return res.status(200).json("Job has been added.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "secretkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: userInfo.id,
    });

    if (deletedJob) {
      return res.status(200).json("Job has been deleted.");
    } else {
      return res.status(403).json("You can delete only your job.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Controller to update job status
export const updateJobStatus = async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  try {
    // Check if job with jobId exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job status
    job.status = status;
    await job.save();

    res.json({ message: "Job status updated successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller to update a job
export const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const {
    title,
    description,
    company,
    location,
    status,
    experience,
    duration,
  } = req.body;

  try {
    // Check if job with jobId exists
    let job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job fields
    job.title = title || job.title;
    job.description = description || job.description;
    job.company = company || job.company;
    job.location = location || job.location;
    job.status = status || job.status;
    job.experience = experience || job.experience;
    job.duration = duration || job.duration;

    // Save the updated job
    job = await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, telephone, description } = req.body;
    const cv = req.file ? req.file.filename : null; // Get the file path from multer
    console.log("running", cv);
    console.log(req.file.filename);
    if (!cv) {
      return res
        .status(400)
        .json({ message: "CV upload failed. Only PDFs are allowed." });
    }
    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Add application to the job's applications array
    job.applications.push({
      name,
      email,
      phone,
      telephone,
      description,
      cv, // Save the file path to the CV
    });

    // Save the updated job
    await job.save();

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.log("crashed");
    console.error(error);
    res.status(500).json({ message: "didn't run Server Error" });
  }
};

// Controller to get applications for a specific job
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Return the applications for the job
    res.status(200).json({ applications: job.applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
