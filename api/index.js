import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import jobRoutes from "./routes/jobs.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import relationshipRoutes from "./routes/relationships.js";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Server class from socket.io

const app = express();
const server = http.createServer(app); // Create HTTP server
// const io = new Server(server); // Create Socket.IO server instance

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://link-up-sage.vercel.app"],
    // credentials: true,
  },
});

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dabiduh:loco157@projectfinal.5crqbft.mongodb.net/socialappconnection?retryWrites=true&w=majority&appName=projectfinal"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json({ limit: "3mb" }));
app.use(cors({ origin: true }));
app.use(cookieParser());

//storing
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    // Use the original filename provided in FormData
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: "510mb",
  },
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log("uploading");
  res.status(200).json(req.file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = 8800;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO integration
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    const { chat } = newMessageReceived;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
