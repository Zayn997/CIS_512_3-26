import React from "react";
import { useLocation } from "react-router-dom";
import "./PersonalInfo.css"; // Add your CSS file for styling
import NavigationBar from "./NavigationBar";

function PersonalInfo() {
  const location = useLocation();
  const { personalInfo } = location.state || {};

  return (
    <div className="personal-info-page">
      <NavigationBar />
      <div className="information-container">
        <h3 className="sub-title">Personal Information</h3>
        <div className="personal-info-content">
          {personalInfo ? (
            <div dangerouslySetInnerHTML={{ __html: personalInfo }}></div>
          ) : (
            <p>No personal information provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
