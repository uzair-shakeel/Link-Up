import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatModel = Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = model("Chat", chatModel);

export default Chat;
