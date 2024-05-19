import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../../components/Chatbox";
import MyChats from "../../components/MyChats";
import SideDrawer from "../../components/miscellaneous/SideDrawer";
import { ChatState } from "../../context/ChatProvider";
import Navbar from "../../components/ChatNav/Navbar";
import "./chat.scss";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div className="w-100 vh-100 bg-slate-300 " style={{ width: "100%" }}>
      <Navbar />
      {user && (
        <SideDrawer
          className="side-drawer w-100"
          style={{ height: "10px !important" }}
        />
      )}

      <Box className="d-flex chatter-box" style={{ height: "550px" }}>
        {user && <MyChats className="my-chat shadow" user={user} />}
        {user && <Chatbox className="chat-box" />}
      </Box>
    </div>
  );
};

export default Chatpage;
