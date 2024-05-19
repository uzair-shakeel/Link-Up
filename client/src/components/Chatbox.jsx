import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  return (
    <Box
      className="align-items-center p-0 p-sm-4 m-7 rounded-lg "
      w={{ base: "100%", md: "68%" }}
      style={{ maxHeight: "530px", height: "530px" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
