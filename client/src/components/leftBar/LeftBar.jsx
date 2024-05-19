import "./leftBar.scss";
import React, { useState } from "react";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Bag from "../../assets/Job.png";
import Open from "../../assets/op.png";
import Closed from "../../assets/Closed.png";
import Posts from "../../assets/8.png";
import Message from "../../assets/10.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import Avatar from "../../assets/avatar.jpg";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { DarkModeContext } from "../../context/darkModeContext";
import { BASE_URL } from "../../axios";
const LeftBar = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);

  const toggleLeftBar = () => {
    setIsLeftBarVisible(!isLeftBarVisible);
  };

  const { isLoading, error, data } = useQuery(["jobs"], async () => {
    const response = await fetch(`${BASE_URL}/jobs`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json();
    return responseData;
  });

  return (
    <>
      {isLeftBarVisible && (
        <>
          <div className="leftbar-behind"></div>
          <div className={`leftBar ${isLeftBarVisible ? "visible" : "hidden"}`}>
            <div className="container">
              <div className="menu">
                <Link
                  to={`/profile/${currentUser._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="user">
                    {currentUser.profilePic ? (
                      <img src={"/upload/" + currentUser.profilePic} alt="" />
                    ) : (
                      <img src={Avatar} alt="Default Avatar" />
                    )}
                    <span>{currentUser.name}</span>
                  </div>
                </Link>
                <Link className="item text-decoration-none" to="/">
                  <img src={Posts} alt="" />
                  <span>Posts</span>
                </Link>
                <Link className="item text-decoration-none" to="/followings">
                  <img src={Friends} alt="" />
                  <span>Followings</span>
                </Link>
                <Link className="item text-decoration-none" to="/followers">
                  <img src={Groups} alt="" />
                  <span>Followers</span>
                </Link>
                <Link className="item text-decoration-none" to="/chats">
                  <img src={Message} alt="" />
                  <span>Chats</span>
                </Link>

                <Link className="item text-decoration-none" to="/jobs">
                  <img src={Bag} alt="" />
                  <span>Jobs</span>
                </Link>

                <Link className="item text-decoration-none" to="/jobs/open">
                  <img src={Open} alt="" />
                  <span>Open Jobs</span>
                </Link>

                <Link className="item text-decoration-none" to="/jobs/closed">
                  <img src={Closed} alt="" />
                  <span>Closed Jobs</span>
                </Link>
              </div>
              <hr />
              <div className="menu">
                <span>Recent Jobs</span>
                {/* Map through the data array and render job names */}
                {data &&
                  data.map((job) => (
                    <Link key={job._id} to={`/jobs/`} className="item">
                      <span style={{ fontWeight: "400" }}>
                        {job.budget <= 1000
                          ? "$"
                          : job.budget <= 5000
                          ? "$$"
                          : "$$$"}
                      </span>
                      <span>{job.title}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
      <button
        className={`toggle-left-bar-btn ${
          isLeftBarVisible ? "visibleBtn" : "hidden"
        } ${darkMode ? "bg-dark text-light" : ""}`}
        onClick={toggleLeftBar}
      >
        {isLeftBarVisible ? (
          <ArrowBackIosIcon style={{ width: "15px" }} />
        ) : (
          <ArrowForwardIosIcon style={{ width: "15px" }} />
        )}
      </button>
    </>
  );
};

export default LeftBar;
