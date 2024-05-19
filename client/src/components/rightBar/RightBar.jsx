import "./rightBar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import Avatar from "../../assets/avatar.jpg";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const RightBar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]); // Initialize as an empty array
  const [onlineFriendsLoading, setOnlineFriendsLoading] = useState(true);
  const [onlineFriendsError, setOnlineFriendsError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchOnlineFriends = async () => {
      try {
        const response = await makeRequest.get("/users/online-followed");
        if (response.status !== 200) {
          throw new Error("Failed to fetch online friends");
        }
        setOnlineFriends(response.data);
        setOnlineFriendsLoading(false);
      } catch (error) {
        console.error(error);
        setOnlineFriendsError("Failed to fetch online friends");
        setOnlineFriendsLoading(false);
      }
    };

    fetchOnlineFriends();
  }, []);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await makeRequest.get("/users/suggestion");
        if (response.status !== 200) {
          throw new Error("Failed to fetch suggested users");
        }

        // Filter out the current user from suggested users
        const filteredUsers = response?.data?.filter(
          (user) => user._id !== currentUser._id
        );

        setSuggestedUsers(filteredUsers);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch suggested users");
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [currentUser.id]);

  const handleFollow = async (followerId) => {
    try {
      const response = await makeRequest.post("/relationships", {
        userId: followerId,
      });
      if (response.status !== 200) {
        throw new Error("Failed to follow");
      }
      setSuggestedUsers(
        suggestedUsers.filter((user) => user._id !== followerId)
      );
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleDismiss = (userId) => {
    // Remove the dismissed user from suggestions
    setSuggestedUsers(suggestedUsers.filter((user) => user._id !== userId));
  };

  return (
    <>
      <div className="rightbar-behind"></div>
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <span>Suggestions For You</span>
            {loading && <span className="d-block pt-3">Loading...</span>}
            {error && <span className="d-block pt-3">{error}</span>}
            {!loading &&
            !error &&
            suggestedUsers &&
            suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <div className="user" key={user._id}>
                  <Link to={`/profile/${user._id}`} className="userInfo">
                    <img
                      className="img-fluid"
                      src={
                        user.profilePic ? "/upload/" + user.profilePic : Avatar
                      }
                      alt={user.username}
                    />
                    <span>{user.name}</span>
                  </Link>
                  <div className="buttons">
                    <button
                      className="btn btn-follow"
                      type="button"
                      onClick={() => handleFollow(user._id)}
                    >
                      <PersonAddIcon />
                    </button>
                    <button
                      className="btn btn-dismiss"
                      type="button"
                      onClick={() => handleDismiss(user._id)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="d-block pt-3">No suggestions available</span>
            )}
          </div>

          <div className="item">
            <span>Online Friends</span>
            {onlineFriendsLoading && (
              <span className="d-block pt-3">Loading...</span>
            )}
            {onlineFriendsError && (
              <span className="d-block pt-3">{onlineFriendsError}</span>
            )}
            {!onlineFriendsLoading &&
            !onlineFriendsError &&
            onlineFriends &&
            onlineFriends?.length > 0 ? (
              onlineFriends?.map((friend) => (
                <div className="user" key={friend._id}>
                  <Link to={`/profile/${friend._id}`} className="userInfo">
                    <img
                      className="img-fluid"
                      src={
                        friend.profilePic
                          ? "/upload/" + friend.profilePic
                          : Avatar
                      }
                      alt={friend.username}
                    />
                    <div className="online" />
                    <span>{friend.name}</span>
                  </Link>
                </div>
              ))
            ) : (
              <span className="d-block pt-3">No online friends available</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightBar;
