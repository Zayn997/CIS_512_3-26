// NavigationBar.js
import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css"; // Importing the CSS file

const NavigationBar = () => {
  return (
    <header className="navigation-header">
      <Link to="/main" className="title-link">
        <h2 className="survey-name">Smart Survey</h2>
      </Link>

      <div className="navigation-buttons">
        <Link to="/results" className="title-link">
          <button className="review-button">Review</button>
        </Link>

        <button className="publish-button">Publish</button>
        <Link to="/personalInfo">
          <i className="fa-user fa-solid fa-circle-user" aria-hidden="true"></i>
        </Link>

        <Link to="/platform">
          <i className="fa-user fa-solid fa-house-user" aria-hidden="true"></i>{" "}
        </Link>

        {/* Additional buttons or icons can be added here */}
      </div>
    </header>
  );
};

export default NavigationBar;
