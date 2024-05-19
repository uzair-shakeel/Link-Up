import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Jobs from "./pages/Jobs/Jobs";
import Open from "./pages/OpenJobs/Jobs";
import Closed from "./pages/ClosedJobs/Jobs";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Followers from "./pages/followers/Followers";
import Chat from "./pages/chats/Chat";
import Followings from "./pages/followings/Followings";
import SearchResult from "./pages/searchResult/SearchResult";
import { makeRequest } from "./axios";
// import Message from "./pages/message/Message";

function App() {
  const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  useEffect(() => {
    if (darkMode === true) {
      document.body.style.backgroundColor = "#333";
    } else {
      document.body.style.backgroundColor = "#f6f3f3";
    }
  }, [darkMode]);

  const Layout = () => {
    const { currentUser } = useContext(AuthContext);
    const [onlineStatus, setOnlineStatus] = useState(false);
    const userId = currentUser.id;

    const updateUserOnlineStatus = async (userId, onlineStatus) => {
      try {
        await makeRequest.put(`/users/online`, { online: onlineStatus });
        console.log("Online status updated successfully");
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          setOnlineStatus(true);
          updateUserOnlineStatus(userId, true);
        } else {
          setOnlineStatus(false);
          updateUserOnlineStatus(userId, false);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }, [userId]);

    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/jobs",
          element: <Jobs />,
        },
        {
          path: "/jobs/open",
          element: <Open />,
        },
        {
          path: "/jobs/closed",
          element: <Closed />,
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
        },
        {
          path: "/followers",
          element: <Followers />,
        },
        {
          path: "/followings",
          element: <Followings />,
        },
        {
          path: "/search-result",
          element: <SearchResult />,
        },
      ],
    },
    {
      path: "/chats",
      element: <Chat />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
