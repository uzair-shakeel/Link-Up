import React, { useState, useEffect } from "react";
import Avatar from "../../assets/avatar.jpg";
import { makeRequest } from "../../axios";
import "./followings.scss";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Followings = () => {
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const response = await makeRequest.get("/relationships/following");
        setFollowings(response.data);
      } catch (error) {
        console.error("Error fetching followings:", error);
      }
    };

    fetchFollowings();
  }, []);

  const handleUnfollow = async (userId) => {
    try {
      await makeRequest.delete(`/relationships?userId=${userId}`);
      setFollowings((prevFollowings) =>
        prevFollowings.filter((following) => following.userId !== userId)
      );

      // Reload window after 2 seconds
      window.location.reload();
    } catch (error) {
      console.error("Error unfollowing:", error);
    }
  };

  return (
    <div className="followings-container container-fluid px-5">
      <div className="d-flex py-4">
        <Link to="/followers" className="btn btn-followers ms-auto">
          Followers <ArrowForwardIcon />
        </Link>
      </div>
      <div className="pb-5">
        <h1 className="text-center">Followings</h1>
        <div className="line"></div>
      </div>
      {followings.map((following) => (
        <div
          key={following?.followedUserId?._id}
          className="follwing rounded-4 my-2 p-2 d-flex justify-content-between align-items-center"
        >
          <Link
            to={`/profile/${following?.followedUserId?._id}`}
            className="d-flex gap-3 uinfo"
          >
            <img
              className="img-fluid rounded-circle profile-img"
              src={
                following?.followedUserId?.profilePic
                  ? "/upload/" + following?.followedUserId?.profilePic
                  : Avatar
              }
              alt=""
            />
            {following?.followedUserId?.online === 1 && (
              <div className="online" />
            )}
            <h5 className="my-auto">{following?.followedUserId?.name}</h5>
          </Link>
          <button
            className="btn btn-primary btn-unfollow"
            onClick={() => handleUnfollow(following?.followedUserId?._id)}
          >
            Unfollow
          </button>
        </div>
      ))}
    </div>
  );
};

export default Followings;
