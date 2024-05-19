import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
// import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Box
      className="cursor-pointer bg-light d-flex align-items-center px-4 py-2 mb-2 rounded text-dark hover:text-white hover:bg-info"
      onClick={handleFunction}
    >
      <Avatar
        className="me-3 fs-sm cursor-pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
