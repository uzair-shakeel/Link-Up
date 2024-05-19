import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  coverPic: { type: String, default: null },
  profilePic: { type: String, default: null },
  city: { type: String, default: null },
  website: { type: String, default: null },
  online: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
