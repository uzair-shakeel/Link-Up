import React, { useContext } from "react";
import "./Modal.scss";
import { DarkModeContext } from "../../context/darkModeContext";

const Modal = ({ isOpen, onClose, children }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div
            className={`modal-content ${darkMode ? "bg-dark" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
