import React, { useContext } from "react";
import { ReactComponent as Sun } from "../../assets/images/Sun.svg";
import { ReactComponent as Moon } from "../../assets/images/Moon.svg";
import "./DarkMode.css";
import { DarkModeContext } from "../../context/darkModeContext";

const DarkMode = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);

  const handleToggle = () => {
    toggle(); // Toggle on if dark mode is currently off
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        checked={darkMode} // Ensure the checkbox reflects the current state
        onChange={() => {}} // Prevent checkbox from changing via user input
      />
      <label
        className="dark_mode_label"
        htmlFor="darkmode-toggle"
        onClick={handleToggle}
      >
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
