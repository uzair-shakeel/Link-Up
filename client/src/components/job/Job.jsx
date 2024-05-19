import "./job.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Avatar from "../../assets/avatar.jpg";
import { toast } from "react-toastify";
import Modal from "../modal/Modal";
import CloseIcon from "@mui/icons-material/Close";
import sad from "../../assets/images/panda";
import { DarkModeContext } from "../../context/darkModeContext";
import { ChatState } from "../../context/ChatProvider";
import TelegramIcon from "@mui/icons-material/Telegram";

const Job = ({ job }) => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [telephone, setTelephone] = useState(null);
  const [description, setDescription] = useState("");
  const [cv, setCV] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const { setSelectedChat, selectedChat } = ChatState();

  const handleFileChange = (event) => {
    setCV(event.target.files[0]);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleSecondModal = () => {
    setIsSecondModalOpen(!isSecondModalOpen);
  };

  const { isLoading, error, data } = useQuery(["likes", job._id], () =>
    makeRequest.get("/likes?postId=" + job._id).then((res) => {
      return res.data;
    })
  );
  const { data: applications } = useQuery(["applications", job._id], () =>
    makeRequest.get(`/jobs/${job._id}/applications`).then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + job._id);
      return makeRequest.post("/likes", { postId: job._id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const deleteMutation = useMutation(
    (jobId) => {
      return makeRequest.delete("/jobs/" + jobId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["jobs"]);
      },
    }
  );

  const closeMutation = useMutation(
    ({ jobId, status }) => {
      return makeRequest.put(`/jobs/status/` + jobId, { status });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch

        toast.success("Job Updated!!");
        queryClient.invalidateQueries(["jobs"]);
      },
      onError: (error) => {
        console.error("Error Closing Job:", error);
        toast.error("Job Not Closed");
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("phone", phone);
    form.append("telephone", telephone);
    form.append("description", description);
    form.append("cv", cv);

    applicationMutation.mutate(form);
  };

  const applicationMutation = useMutation(
    (formData) => {
      return makeRequest.post(`/jobs/${job._id}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    {
      onSuccess: () => {
        setIsOpen(false);
        toast.success("Job Application Submitted!!");
        queryClient.invalidateQueries(["jobs"]);
      },
      onError: (error) => {
        setIsOpen(false);
        console.error("Error submitting job application:", error);
        toast.error("Job Application not Submitted!!");
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser._id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(job._id);
    toast.success("Job Deleted Successfull");
  };

  const handleClose = () => {
    let status = "closed";
    closeMutation.mutate({ jobId: job._id, status: status });
  };

  const handleOpen = () => {
    let status = "open";
    closeMutation.mutate({ jobId: job._id, status: status });
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      // Make the request to the server
      const response = await makeRequest.post(`/chat`, { userId });

      // Check if the response status is within the success range
      if (response.status >= 200 && response.status < 300) {
        // If successful, update the selected chat and close the drawer
        setSelectedChat(response.data);
        console.log("selectedChat: ", selectedChat);
      } else {
        // If not successful, throw an error
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      setLoadingChat(false);
    } catch (error) {
      // Catch and handle any errors that occur during the request
      console.log("Error fetching the chat:", error);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            {job.userId.profilePic ? (
              <img src={"/upload/" + job.userId.profilePic} alt="" />
            ) : (
              <img src={Avatar} alt="Default Avatar" />
            )}
            <div className="details">
              <Link
                to={`/profile/${job.userId._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className={`name ${darkMode ? "text-light" : ""}`}>
                  {job.userId.name}
                </span>
              </Link>
              <span className={`name ${darkMode ? "text-light" : ""}`}>
                {moment(job.createdAt).fromNow()}
              </span>
            </div>
          </div>
          {job.userId._id === currentUser._id && (
            <>
              <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && (
                <>
                  {job.status === "open" ? (
                    <button className="btn" onClick={handleClose}>
                      Stop Hiring
                    </button>
                  ) : (
                    <>
                      <button className="greenButton" onClick={handleOpen}>
                        Start Hiring
                      </button>
                      <button className="deleteBtn" onClick={handleDelete}>
                        Delete Job
                      </button>
                    </>
                  )}

                  {/* <button className="btn" onClick={handleDelete}>
          delete
        </button> */}
                </>
              )}
            </>
          )}
        </div>
        <div className="content">
          <div className="title-div">
            <p className="title">{job.title}</p>
            <div className="location-parent">
              <div className="location-div">
                <LocationOnIcon />
                <p className="location">{job.location}</p>
              </div>
              <div className="company-div">
                <BusinessIcon />
                <p className="company">{job.company}</p>
              </div>
            </div>
          </div>

          <p className={`details ${darkMode ? "text-light" : ""}`}>
            {job.duration} - {job.experience} - Budget ${job.budget}
          </p>

          <p className="description">{job.description}</p>
          {job.img &&
            (job.img.endsWith(".mp4") ? (
              <video className="media" controls>
                <source src={"/upload/" + job.img} type="video/mp4" />
              </video>
            ) : (
              <img className="media" src={"/upload/" + job.img} alt="" />
            ))}
        </div>
        <div className="info">
          <div className="low">
            <div className="item">
              {isLoading ? (
                "loading"
              ) : data.includes(currentUser._id) ? (
                <ThumbUpIcon
                  style={{ color: "#564df6" }}
                  onClick={handleLike}
                />
              ) : (
                <ThumbUpOffAltIcon onClick={handleLike} />
              )}
              {data?.length} {data?.length === 1 ? "Vote" : "Votes"}
            </div>
            <div className="item">
              <PeopleIcon />
              {applications?.applications?.length} Applicants
            </div>
            {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
          </div>

          {job.userId._id !== currentUser._id ? (
            <div className="info">
              {/* Apply Now button */}
              {job.status === "closed" ? (
                <button className="closedBtn" disabled>
                  Closed
                </button>
              ) : (
                <>
                  <Link to={"/chats"}>
                    <button
                      className="btn shake-on-hover"
                      onClick={() => accessChat(job.userId._id)}
                    >
                      <TelegramIcon />
                    </button>
                  </Link>
                  <button className="blueBtn" onClick={toggleModal}>
                    Apply Now
                  </button>
                </>
              )}
            </div>
          ) : (
            <button className="yellowButton" onClick={toggleSecondModal}>
              See Applications
            </button>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        <h2>Submit your details</h2>
        <CloseIcon className="icon" onClick={() => setIsOpen(false)} />
        <form>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
            className="space-x-4"
          >
            <div>
              <input
                type="text"
                id="name"
                placeholder="Name *"
                className={`${darkMode ? "bg-dark" : ""}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email *"
                className={`${darkMode ? "bg-dark" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="number"
                id="phone"
                placeholder="Phone *"
                className={`${darkMode ? "bg-dark" : ""}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="number"
                id="telephone"
                placeholder="Telephone *"
                className={`${darkMode ? "bg-dark" : ""}`}
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>
          </div>

          <div className="textarea">
            <textarea
              id="description"
              placeholder="Cover Letter *"
              className={`${darkMode ? "bg-dark" : ""}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              background: "white",
              marginBottom: "20px",
              backgroundColor: "white",
            }}
          >
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "red",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <p style={{}}>Please upload your CV.</p> */}
              <p>Note: Only PDF formats are acceptable.</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              !name || !email || !phone || !description || !telephone || !cv
            }
            className="greenButtonFull"
          >
            Apply Now
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isSecondModalOpen}
        onClose={toggleSecondModal}
        style={{ maxWidth: "95%", margin: "0 auto" }}
      >
        <h2>
          {applications?.applications?.length} Applicants Applied for the Job.
        </h2>
        <CloseIcon
          className="icon"
          onClick={() => setIsSecondModalOpen(false)}
        />
        {applications?.applications?.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={sad} alt="" style={{ width: "100px" }} />
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  S. #
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  Phone
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  Telephone
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  CV
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Render table rows with application data */}
              {applications?.applications.map((application, index) => (
                <tr key={application.id}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {application.name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {application.email}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {application.phone}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    {application.telephone === null && "-"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {application.description}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <a
                      href={`/upload/CVs/${application.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                        color: "#564df6",
                      }}
                    >
                      View CV
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default Job;
