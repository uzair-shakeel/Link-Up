import React from "react";
import {
  Box,
  Button,
  Input,
  Tooltip,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import { BASE_URL, makeRequest } from "../../axios";
import "./drawer.scss";

const SideDrawer = () => {
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingChat, setLoadingChat] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setSelectedChat, selectedChat } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter something in search");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/users?search=${search}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log("Error occurred:", error);
    }
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
        onClose();
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
    <div className="d-flex">
      <div className="behind-spacer d-block" style={{ height: "50px" }}></div>
      <Box
        className={`position-fixed d-flex justify-content-start  bg-opacity-60 items-center w-100 p-2 align-items-center px-0 px-md-4`}
        style={{ fontSize: "22px", fontWeight: "bold" }}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button onClick={onOpen} style={{ fontSize: "10px !important" }}>
            Search Buddy.
          </Button>
        </Tooltip>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom="1px solid">Search Users</DrawerHeader>
          <DrawerBody>
            <Box className="d-flex pb-2 gap-2 align-items-center">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="my-4">
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner className="ms-auto d-flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
