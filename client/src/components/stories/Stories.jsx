import React, { useContext, useState, useEffect } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Avatar from "../../assets/avatar.jpg";
import Story from "react-insta-stories";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [file, setFile] = useState(null);

  const mutation = useMutation(
    (newStory) => makeRequest.post("/stories", newStory),
    {
      onSuccess: () => {
        setStories([]);
      },
      onError: (error) => {
        console.error("Error uploading story:", error);
      },
    }
  );

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadClick = async () => {
    if (file) {
      await uploadStory(file);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  console.log(currentUser);

  const uploadStory = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData, {
        // Increase timeout to handle slow connections
        timeout: 60000, // 60 seconds
        validateStatus: (status) => status >= 200 && status < 500,
      });
      const imgUrl = res.data;
      const newStory = {
        img: imgUrl,
        userId: currentUser._id,
        name: currentUser.name,
        profile: currentUser.profilePic,
      };

      await mutation.mutate(newStory);
    } catch (error) {
      console.error("Error uploading story:", error);
    }
  };

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => res.data)
  );

  useEffect(() => {
    if (data && data?.length > 0) {
      const groupedStories = {};
      data?.forEach((story) => {
        if (!(story.userId in groupedStories)) {
          groupedStories[story.userId] = [];
        }
        groupedStories[story.userId].push({
          url: "/upload/" + story.img,
          name: story.name,
          userId: story.userId,
          storyId: story._id,
        });
      });
      setStories(groupedStories);
    }
  }, [data]);

  const handleStoryClick = (userId, storyIndex) => {
    setCurrentUserId(userId);
    setCurrentStoryIndex(storyIndex);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUserId(null);
    setCurrentStoryIndex(0);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories[currentUserId].length - 1) {
      const nextIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(nextIndex);
      setCurrentStoryId(stories[currentUserId][nextIndex]?.storyId);
    } else {
      handleCloseModal();
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevIndex);
      setCurrentStoryId(stories[currentUserId][prevIndex]?.storyId);
    }
  };

  const handleClickOutsideModal = (e) => {
    if (!e.target.closest(".modal-content") && !e.target.closest(".stories")) {
      handleCloseModal();
    }
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    (storyId) => {
      return makeRequest.delete("/stories/" + storyId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  const handleDelete = async (storyId) => {
    try {
      await deleteMutation.mutateAsync(storyId, {
        onSuccess: () => {
          setStories((prevStories) => {
            const updatedStories = { ...prevStories };
            if (updatedStories[currentUserId]) {
              updatedStories[currentUserId] = updatedStories[
                currentUserId
              ].filter((story) => story.storyId !== storyId);

              // Check if the current story index needs adjustment
              if (currentStoryIndex >= updatedStories[currentUserId].length) {
                handleCloseModal(); // Close the modal if the current story is deleted
                return updatedStories; // Return the updated stories
              }
            }
            return updatedStories; // Return the updated stories
          });
        },
      });
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("click", handleClickOutsideModal);
    } else {
      document.removeEventListener("click", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  return (
    <>
      <h3 className="stories-heading">Stories</h3>
      <div className="stories">
        <div className="my-story">
          <label htmlFor="fileInput" className="story">
            {currentUser.profilePic ? (
              <img src={"/upload/" + currentUser.profilePic} alt="" />
            ) : (
              <img src={Avatar} alt="Default Avatar" />
            )}
            <span>{currentUser.name}</span>
            {file ? ( // Render "upload" text if file is selected
              <button
                onClick={handleUploadClick}
                className="upload-btn btn btn-primary mx-auto"
              >
                Upload
              </button>
            ) : (
              <div>+</div>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input element visually
            />
          </label>
        </div>
        {error && "Something went wrong"}
        {isLoading ? (
          "Loading"
        ) : Object.keys(stories).length === 0 ? (
          <span className="no-story my-auto">No stories available</span>
        ) : (
          Object.entries(stories).map(([userId, userStories]) => (
            <div key={userId}>
              {userStories && userStories.length > 0 && (
                <div
                  className="story my-auto"
                  onClick={() => handleStoryClick(userId, 0)}
                >
                  <img src={userStories[0].url} alt="" />
                  <span>{userStories[0].name}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {stories[currentUserId] &&
              stories[currentUserId][currentStoryIndex].userId ===
                currentUser._id && (
                <button
                  className="story-delete btn btn-danger"
                  onClick={() =>
                    handleDelete(
                      stories[currentUserId][currentStoryIndex].storyId
                    )
                  }
                >
                  <DeleteOutlinedIcon />
                </button>
              )}
            <Story
              stories={stories[currentUserId]}
              currentIndex={currentStoryIndex}
              width="100%"
              height="100vh"
              onAllStoriesEnd={handleCloseModal}
              onStoryEnd={handleNextStory}
              onPreviousStory={handlePreviousStory}
              onNext={handleNextStory}
              onPrevious={handlePreviousStory}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
