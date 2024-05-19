import "./share.scss";
import Image from "../../assets/img.png";
import Video from "../../assets/9.png";
import { useContext, useState, useRef, useEffect } from "react"; // Import useRef
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Avatar from "../../assets/avatar.jpg";
import { DarkModeContext } from "../../context/darkModeContext";

const Share = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const [uploading, setUploading] = useState(false); // State to track upload status
  const videoRef = useRef(null); // Create a ref for the video element

  const upload = async (fileName, e) => {
    try {
      if (e) {
        e.preventDefault();
      }
      const formData = new FormData();
      formData.append("file", file, fileName);
      const config = {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress); // Update upload progress
        },
        timeout: 3600000, // Set timeout to 60 seconds (adjust as needed)
      };

      const res = await makeRequest.post("/upload", formData, config);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err; // Propagate error to the caller
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => makeRequest.post("/posts", newPost),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
        setUploading(false); // Reset uploading state
      },
      onError: (error) => {
        console.error("Error creating post:", error);
        setUploading(false); // Reset uploading state
      },
    }
  );

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setFile(e.target.files[0]);
    // Reset video playback when a new video is selected
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setUploading(true);
    if (file) {
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const fileName = `file_${timestamp}_${file.name}`;
      console.log(fileName);

      mutation.mutate({ desc, img: fileName });
      if (file) await upload(fileName);
      setDesc("");
      setFile(null);
      setUploadProgress(0); // Reset upload progress
    } else {
      mutation.mutate({ desc, img: "" });
      setDesc("");
      setFile(null);
      setUploadProgress(0); // Reset upload progress
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top d-flex">
          <div className="left">
            {currentUser.profilePic ? (
              <img src={"/upload/" + currentUser.profilePic} alt="" />
            ) : (
              <img src={Avatar} alt="Default Avatar" />
            )}
            <input
              type="text"
              id="desc"
              className={`${darkMode ? "bg-dark" : "bg-transparent"}`}
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && file.type.startsWith("image/") && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
            {file && file.type.startsWith("video/") && (
              <video className="file" ref={videoRef} controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="imageFile"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="imageFile">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <input
            type="file"
            id="videoFile"
            style={{ display: "none" }}
            accept="video/mp4,video/webm,video/mov,video/flv,video/m4v,video/ogg"
            onChange={handleVideoChange}
          />
          <label htmlFor="videoFile">
            <div className="item">
              <img src={Video} alt="" />
              <span>Add Video</span>
            </div>
          </label>
          
          </div>
          <div className="right">
            <button
              className="btn"
              onClick={handleClick}
              type="button"
              disabled={uploading}
            >
              {uploading ? (
                <span>Uploading... ({uploadProgress}%)</span>
              ) : (
                <span>Share</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
