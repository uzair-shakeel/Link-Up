import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema(
    {
      followerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      followedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );

  export default mongoose.model("relationship", relationshipSchema);