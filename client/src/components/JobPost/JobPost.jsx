import "./JobPost.scss";
import { useContext, useState, useRef, useEffect } from "react"; // Import useRef
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import CancelIcon from "@mui/icons-material/Cancel";
import { DarkModeContext } from "../../context/darkModeContext";
import { duration } from "moment";
import Image from "../../assets/img.png";
import Video from "../../assets/9.png";

const Share = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [file, setFile] = useState(null);
  const videoRef = useRef(null); // Create a ref for the video element

  const [inputs, setInputs] = useState({
    title: "",
    location: "",
    company: "",
    duration: "",
    experience: "",
    description: "",
    budget: null,
    img: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to track whether to show the form

  const handleShow = () => {
    setShowForm(true); // Show the form when "Hire Now" is clicked
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation((newJob) => makeRequest.post("/jobs", newJob), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["jobs"]);
      toast.success("Job Created Successfully");
      setUploading(false); // Reset uploading state
      setShowForm(false);
      setInputs({
        title: "",
        location: "",
        company: "",
        duration: "",
        experience: "",
        description: "",
        budget: null,
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error("Job Not Created");
      setUploading(false); // Reset uploading state
    },
  });

  // const handleClick = async (e) => {
  //   e.preventDefault();
  //   setUploading(true);
  //   console.log("Mutations", inputs);

  //   mutation.mutate({
  //     title: inputs.title,
  //     location: inputs.location,
  //     company: inputs.company,
  //     duration: inputs.duration,
  //     experience: inputs.experience,
  //     description: inputs.description,
  //     budget: inputs.budget,
  //     img: file
  //   });

  //   setUploadProgress(0); // Reset upload progress
  // };

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

  const handleClick = async (e) => {
    e.preventDefault();
    setUploading(true);
    if (file) {
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const fileName = `file_${timestamp}_${file.name}`;
      console.log(fileName);

      mutation.mutate({
        title: inputs.title,
        location: inputs.location,
        company: inputs.company,
        duration: inputs.duration,
        experience: inputs.experience,
        description: inputs.description,
        budget: inputs.budget,
        img: fileName,
      });
      if (file) await upload(fileName);
      setInputs({
        title: "",
        location: "",
        company: "",
        duration: "",
        experience: "",
        description: "",
        budget: null,
        img: "",
      });
      setUploadProgress(0); // Reset upload progress
    } else {
      mutation.mutate({
        title: inputs.title,
        location: inputs.location,
        company: inputs.company,
        duration: inputs.duration,
        experience: inputs.experience,
        description: inputs.description,
        budget: inputs.budget,
        img: "",
      });
      setInputs({
        title: "",
        location: "",
        company: "",
        duration: "",
        experience: "",
        description: "",
        budget: null,
        img: "",
      });
      setFile(null);
      setUploadProgress(0); // Reset upload progress
    }
  };

  return (
    <div className="share">
      <div className="container">
        {!showForm ? ( // Render "Hire Now" button if showForm is false
          <div className="bottom">
            <button className="btn" onClick={handleShow}>
              Hire Now
            </button>
          </div>
        ) : (
          <form>
            <CancelIcon onClick={() => setShowForm(false)} className="cancel" />
            <div className="top">
              <div className="left">
                <input
                  type="text"
                  placeholder="Job Title"
                  className={` ${darkMode ? "bg-dark" : ""}`}
                  name="title"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className={` ${darkMode ? "bg-dark" : ""}`}
                  placeholder="City"
                  name="location"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  className={` ${darkMode ? "bg-dark" : ""}`}
                  placeholder="Budget"
                  name="budget"
                  onChange={handleChange}
                />
              </div>
              <div className="right">
                <input
                  type="text"
                  className={` ${darkMode ? "bg-dark" : ""}`}
                  placeholder="Company Name"
                  name="company"
                  onChange={handleChange}
                />
                <select
                  className={` ${darkMode ? "bg-dark" : ""}`}
                  name="duration"
                  onChange={handleChange}
                >
                  <option value="">Select duration</option>
                  <option value="Shortterm">Shortterm Job</option>
                  <option value="Longterm">Longterm Job</option>
                </select>
                <select
                  className={` ${darkMode ? "bg-dark" : ""}`}
                  name="experience"
                  onChange={handleChange}
                >
                  <option value="">Select experience level</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
            <textarea
              className={` ${darkMode ? "bg-dark" : ""}`}
              placeholder="Please Describe the Job a lil bit."
              name="description"
              onChange={handleChange}
            />
            {file && file.type.startsWith("image/") && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
            {file && file.type.startsWith("video/") && (
              <video className="file" ref={videoRef} controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
              </video>
            )}
            <hr />
            <div className="bottom">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="file"
                  id="imageFile"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="imageFile">
                  <div
                    className="item"
                    style={{
                      minWidth: "100px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <img src={Image} alt="" />
                    <span>Add Image</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="videoFile"
                  style={{ display: "none" }}
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                <label htmlFor="videoFile">
                  <div
                    className="item"
                    style={{
                      minWidth: "100px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <img src={Video} alt="" />
                    <span>Add Video</span>
                  </div>
                </label>
              </div>

              <button
                className="btn"
                onClick={handleClick}
                type="button"
                disabled={
                  uploading ||
                  !inputs.title ||
                  !inputs.location ||
                  !inputs.company ||
                  !inputs.duration ||
                  !inputs.experience ||
                  !inputs.description ||
                  !inputs.budget
                }
              >
                {uploading ? (
                  <span>Uploading... ({uploadProgress}%)</span>
                ) : (
                  <span>Post a Job</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Share;
