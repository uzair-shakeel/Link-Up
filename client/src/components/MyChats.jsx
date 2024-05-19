import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import { getSender2 } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { DarkModeContext } from "../context/darkModeContext";
import { BASE_URL } from "../axios";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setChats(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const { darkMode } = useContext(DarkModeContext);
  return (
    <Box
      className="rounded-lg  ms-0 ms-sm-4 p-sm-4 m-7  chat-list-box"
      style={{ height: "490px", minHeight: "530px" }}
      d={{ base: selectedChat ? "none" : "fixed", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={0}
      w={{ base: "100%", md: "31%" }}
    >
      <Box
        className={`${
          darkMode ? "bg-dark text-white" : "light-theme "
        } d-flex p-4 pt-3 pt-sm-5 text-28 w-100 bg-light justify-content-between align-items-center`}
      >
        <Text
          className="chat-main-heading my-auto"
          style={{ fontSize: "22px", fontWeight: "bold" }}
        >
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            className="chat-main-heading d-flex"
            style={{ fontSize: "12px" }}
          >
            <AddIcon />
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        className={`${
          darkMode ? "bg-dark" : "text-white"
        } chat-list-box d-flex flex-column p-4 pt-0 w-100 overflow-y-auto bg-light`}
        style={{
          maxHeight: "410px",
          height: "400px !important",
          minWidth: "150px",
        }}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                className={
                  "chat-lists cursor-pointer px-3 py-0 rounded" +
                  (selectedChat === chat ? " bg-primary text-white" : "")
                }
                style={{
                  ...(selectedChat !== chat && {
                    backgroundColor: "lightgray",
                    color: "black",
                  }),
                }}
                key={chat._id}
              >
                <Text className="my-2">
                  {!chat.isGroupChat
                    ? getSender2(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text
                    className="text-xs"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%", // Limit the maximum width to prevent unnecessary overflow
                    }}
                  >
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
