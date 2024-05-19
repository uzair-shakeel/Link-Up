import React, { useState, useEffect, useContext } from 'react';
import Avatar from '../../assets/avatar.jpg';
import './search-result.scss';
import { Link, useLocation } from 'react-router-dom';
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const SearchResult = () => {
  const location = useLocation();
  const users = location.state.users || [];
  const searchTerm = new URLSearchParams(location.search).get('q');
  const [followingMap, setFollowingMap] = useState({});
  const { currentUser } = useContext(AuthContext);

  const [followers, setFollowers] = useState([]);
  

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
  
  useEffect(() => {
    window.scrollTo(0, -1);
  }, []);


  const handleFollow = async (userId) => {
    try {
      const updatedFollowingMap = { ...followingMap };

      if (followingMap[userId]) {
        await makeRequest.delete(`/relationships?userId=${userId}`);
        updatedFollowingMap[userId] = false;
      } else {
        await makeRequest.post("/relationships", { userId });
        updatedFollowingMap[userId] = true;
      }

      setFollowingMap(updatedFollowingMap);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className='search-container container-fluid px-5'>
      <div className="py-5">
        <h1>Search Result for "{searchTerm}":</h1>
      </div>
      {users.length > 0 ? (
        <div>
          {users.map(user => (
            <div key={user._id} className='search-item rounded-4 my-2 p-2 d-flex justify-content-between align-items-center'>
              <Link to={`/profile/${user._id}`} className='d-flex gap-3 uinfo'>
                {user.profilePic ? (
                  <img className='img-fluid rounded-circle profile-img' src={`/upload/${user.profilePic}`} alt={user.username} />
                ) : (
                  <img className='img-fluid rounded-circle profile-img' src={Avatar} alt="" />
                )}
                <h5 className='my-auto'>{user.name || user.username}</h5>
              </Link>
              {currentUser && currentUser._id !== user._id && (
                <button className='btn btn-primary btn-follow' onClick={() => handleFollow(user._id)}>
                  {followingMap[user._id] ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};


export default SearchResult;
