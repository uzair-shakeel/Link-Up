import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { makeRequest } from "../axios";
import { Link } from "react-router-dom";

const JobChat = ({ job }) => {
  const [loadingChat, setLoadingChat] = useState(false);
  const { setSelectedChat, selectedChat } = ChatState();

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
    <div>
      <Link to={"/chats"}>
        <button className="blueBtn" onClick={accessChat(job.userId._id)}>
          Chat Now
        </button>
      </Link>
    </div>
  );
};

export default JobChat;
