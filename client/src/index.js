import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ChatProvider from "./context/ChatProvider";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <ChatProvider>
        <AuthContextProvider>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            pauseOnHover={true}
            closeOnClick={true}
            draggable={true}
          />
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </AuthContextProvider>
      </ChatProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
