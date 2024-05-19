import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import Toggle from "./../DarkMode/DarkMode";
import Avatar from "../../assets/avatar.jpg";
import { toast } from "react-toastify";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = async () => {
    try {
      console.log("Online status updated successfully");
      toast.success("Logout Successfully!");
      await makeRequest.put(`/users/online`, { online: false });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  };

  const handleSearchInput = async (value) => {
    setSearchTerm(value); // Update search term state

    if (!value.trim()) {
      setSearchResults([]); // Clear search results if input is empty
      return;
    }

    try {
      const response = await makeRequest.get(
        `users/search?searchTerm=${value}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to search users: ${response.statusText}`);
      }
      setSearchResults(response.data); // Update search results
    } catch (error) {
      console.error("Error searching users:", error.message);
      setSearchResults([]); // Clear search results in case of error
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await makeRequest.get(
        `users/search?searchTerm=${searchTerm}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to search users: ${response.statusText}`);
      }
      navigate(`/search-result?q=${searchTerm}`, {
        state: { users: response.data },
      });
      setSearchResults([]);
    } catch (error) {
      console.error("Error searching users:", error.message);
      // Optionally, display an error message to the user
    }
  };

  const hideSearchInput = (event) => {
    if (window.innerWidth < 767) {
      setIsSearchVisible(false);
    }
  };

  const updateSearchVisibility = () => {
    const isSmallScreen = window.innerWidth > 767;
    setIsSearchVisible(isSmallScreen);
    setIsOffcanvasVisible(!isSmallScreen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is outside the search container or the navbar
      if (
        !event.target.closest(".search-container") ||
        !event.target.closest(".navbar")
      ) {
        setSearchResults([]); // Clear search results
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [searchTerm]);

  useEffect(() => {
    updateSearchVisibility();
    window.addEventListener("resize", updateSearchVisibility);
    return () => {
      window.removeEventListener("resize", updateSearchVisibility);
    };
  }, []);

  useEffect(() => {
    if (!location.pathname.includes("/search-result")) {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className={`d-block navbar-behind ${darkMode ? "dark-navbar" : ""}`}
      ></div>
      <nav
        className={`navbar navbar-expand-md ${
          darkMode ? "navbar-dark dark-navbar bg-dark" : "bg-white text-dark"
        } fixed-top `}
      >
        <div className="container-fluid ">
          <NavLink
            className={`navbar-brand ${darkMode ? "text-white" : ""}`}
            to="/"
          >
            LinkUp.
          </NavLink>
          <button
            className="navbar-toggler my-auto"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`offcanvas offcanvas-end ${
              isOffcanvasVisible ? "offcanvas-visible" : ""
            } ${darkMode ? "text-bg-dark" : ""}`}
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <button
                type="button"
                onClick={hideSearchInput}
                className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="offcanvas-body align-item-center"
              id="navbarSupportedContent"
            >
              <ul
                className={`navbar-nav justify-content-start gap-4 gap-md-0 flex-grow-1 ${
                  darkMode ? "text-light" : ""
                }`}
              >
                {/* <li className="nav-item mx-auto my-auto mx-md-2">
                  {darkMode ? (
                    <WbSunnyOutlinedIcon
                      onClick={toggle}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <DarkModeOutlinedIcon
                      onClick={toggle}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </li> */}
                <li
                  className={`position-relative nav-item mx-auto mx-md-2 my-auto search mb-3 mb-md-0 ${
                    darkMode ? "border-light" : ""
                  }`}
                >
                  {isSearchVisible ? (
                    <>
                      <form
                        className="d-flex gap-1 align-items-center"
                        onSubmit={handleSearch}
                      >
                        <SearchOutlinedIcon />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          className={`${
                            darkMode ? "search-input text-light" : ""
                          }`}
                          onChange={(e) => handleSearchInput(e.target.value)}
                        />
                      </form>
                      {searchResults.length > 0 && (
                        <ul className="search-results shadow mx-auto">
                          {searchResults.map((result) => (
                            <Link to={`/profile/${result._id}`}>
                              <li className="search-item" key={result._id}>
                                {result.name}
                              </li>
                            </Link>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => setIsSearchVisible(true)}
                    >
                      <SearchOutlinedIcon />
                    </button>
                  )}
                </li>
              </ul>
              <div
                className={`right d-flex flex-column  flex-md-row gap-4 gap-md-3 justify-content-start ${
                  darkMode ? "text-light" : ""
                }`}
              >
                <NavLink
                  activeStyle={{ backgroundColor: "#f0f0f0" }}
                  className={` align-items-center d-flex flex-column justify-content-center ${
                    darkMode ? "darkIcons" : "icons"
                  } ${location.pathname === "/" ? "active" : ""}`}
                  // className="icons align-items-center d-flex flex-column justify-content-center"
                  aria-current="page"
                  to="/"
                >
                  <HomeOutlinedIcon style={{ fontSize: "26px" }} />
                </NavLink>

                <NavLink
                  className={`${
                    darkMode ? "darkIcons" : "icons"
                  } align-items-center d-flex flex-column justify-content-center  ${
                    location.pathname === "/jobs" ? "active" : ""
                  }`}
                  // className="icons align-items-center d-flex flex-column justify-content-center"
                  aria-current="page"
                  to="/jobs"
                >
                  <WorkOutlineIcon style={{ fontSize: "24px" }} />
                </NavLink>
                {/* 
                <NavLink
                  to="/followings"
                  className="following align-items-center d-flex flex-column justify-content-center"
                >
                  <PersonOutlinedIcon />
                </NavLink> */}
                <NavLink
                  to="/chats"
                  className={`${
                    darkMode ? "darkIcons" : "icons"
                  } align-items-center d-flex flex-column justify-content-center ${
                    location.pathname === "/chats" ? "active" : ""
                  }`}
                  // className="icons align-items-center d-flex flex-column justify-content-center"
                >
                  <EmailOutlinedIcon />
                </NavLink>
                <div className="following align-items-center d-flex flex-column justify-content-center">
                  <Toggle />
                </div>

                <div className="profile dropdown align-items-center d-flex flex-column justify-content-center">
                  <div className="position-relative">
                    <button
                      className="nav-link d-flex flex-column flex-md-row align-items-center "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {currentUser?.profilePic ? (
                        <img
                          src={"/upload/" + currentUser?.profilePic}
                          className="profileimg img-fluid rounded-circle"
                          alt=""
                        />
                      ) : (
                        <img
                          src={Avatar}
                          className="profileimg img-fluid rounded-circle"
                          alt=""
                        />
                      )}
                    </button>
                    <ul
                      className={`dropdown-menu text-center position-absolute ${
                        darkMode ? "dropdown-menu-dark" : ""
                      } ${
                        window.innerWidth >= 768
                          ? "start-30 translate-middle-x"
                          : "start-50 translate-middle-x"
                      }`}
                    >
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/profile/${currentUser?._id}`}
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleLogout(currentUser?._id)}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
