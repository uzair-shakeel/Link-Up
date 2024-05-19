import React, { useState, useEffect } from "react";
import Avatar from "../../assets/avatar.jpg";
import { makeRequest } from "../../axios";
import "./followers.scss";
import { Link } from "react-router-dom";
import ArrowBackwardIcon from "@mui/icons-material/ArrowBack";

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const [followersResponse, followingResponse] = await Promise.all([
          makeRequest.get("/relationships/follower"),
          makeRequest.get("/relationships/following"),
        ]);

        // Extract follower IDs from the followers response
        const followerIds = followersResponse.data.map((follower) => follower.followerUserId._id);

        // Extract followed user IDs from the following response
        const followingIds = followingResponse.data.map((following) => following.followedUserId._id);

        // Create a following map based on whether the user is following each follower
        const followingMap = {};
        followerIds.forEach((followerId) => {
          followingMap[followerId] = followingIds.includes(followerId);
        });

        // Set followers and following map states
        setFollowers(followersResponse.data);
        setFollowingMap(followingMap);
      } catch (error) {
        console.error("Error fetching followers and following:", error);
      }
    };

    fetchFollowersAndFollowing();
  }, []);

  const handleFollow = async (followerId) => {
    try {
      const response = followingMap[followerId]
        ? await makeRequest.delete(`/relationships?userId=${followerId}`)
        : await makeRequest.post("/relationships", { userId: followerId });

      // Update following map
      const updatedFollowingMap = { ...followingMap, [followerId]: !followingMap[followerId] };
      setFollowingMap(updatedFollowingMap);

      // Update followers list if the request was successful
      if (response.status === 200) {
        const updatedFollowersResponse = await makeRequest.get("/relationships/follower");
        setFollowers(updatedFollowersResponse.data);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="followers-container container-fluid px-5">
      <div className="d-flex py-4">
        <Link to="/followings" className="btn btn-followers">
          <ArrowBackwardIcon /> Followings
        </Link>
      </div>
      <div className="pb-5">
        <h1 className="text-center ">Followers</h1>
        <div className="line"></div>
      </div>
      {followers.map((follower) => (
        <div
  key={follower._id}
  className="follower rounded-4 my-2 p-2 d-flex justify-content-between align-items-center"
>
  <Link
    to={`/profile/${follower.followerUserId._id}`}
    className="d-flex gap-3 uinfo"
  >
    <img
      className="img-fluid rounded-circle profile-img"
      src={
        follower.followerUserId.profilePic
          ? "/upload/" + follower.followerUserId.profilePic
          : Avatar
      }
      alt=""
    />
    {follower.followerUserId.online === 1 && <div className="online" />}
    <h5 className="my-auto">{follower.followerUserId.name}</h5>
  </Link>
  <button
    className="btn btn-primary btn-follow"
    onClick={() => handleFollow(follower.followerUserId._id)}
  >
    {followingMap[follower.followerUserId._id] ? "Following" : "Follow"}
  </button>
</div>
      ))}
    </div>
  );
};

export default Followers;
