import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
      desc: {
        type: String,
        default: "",
      },
      img: {
        type: String,
        default: null,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );

  export default mongoose.model("Post", postSchema);
