// jobModel.js - JobsSchema

import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: null,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    enum: ["Fresh", "Intermediate", "Expert"], // Add more statuses as needed
    default: "Fresh",
  },
  duration: {
    type: String,
    enum: ["Shortterm", "Longterm"], // Add more statuses as needed
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"], // Add more statuses as needed
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: Number, required: true }, // This could be a file path or URL to the resume
      telephone: { type: Number },
      description: { type: String }, // This could be a file path or URL to the resume
      appliedAt: { type: Date, default: Date.now },
      cv: { type: String, required: true }, // Path to the uploaded CV
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
