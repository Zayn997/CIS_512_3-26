// Sidebar.js
import React from "react";
import "./SideBar.css"; // Make sure to import the CSS styles
import { useNavigate } from "react-router-dom";

// Add more icons as needed

function SideBar() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // This function will be called when the back icon is clicked
    navigate("/signin"); // Adjust the path as needed for your sign-in route
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-icon">
        <i className="fa fa-home" aria-hidden="true"></i> {/* Home icon */}
      </div>
      <div className="sidebar-icon">
        <i className="fa fa-envelope-open" aria-hidden="true"></i>{" "}
        {/* Survey icon */}
      </div>
      <div className="sidebar-icon">
        <i
          className="fa fa-solid fa-right-from-bracket"
          aria-hidden="true"
          onClick={() => navigate("/")}
        ></i>{" "}
        {/* Survey icon */}
      </div>
      {/* Add more sidebar icons as needed */}
    </div>
  );
}

export default SideBar;
