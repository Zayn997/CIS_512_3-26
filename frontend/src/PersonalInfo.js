import React from "react";
import { useLocation } from "react-router-dom";
import "./PersonalInfo.css"; // Add your CSS file for styling
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
function PersonalInfo() {
  const location = useLocation();
  const { personalInfo } = location.state || {};
  const navigate = useNavigate();

  // Convert the string back into an object
  const personalInfoObject = personalInfo
    ? personalInfo.split(", ").reduce((obj, item) => {
        const [key, value] = item.split(": ");
        obj[key] = value;
        return obj;
      }, {})
    : {};

  const handleBack = () => {
    navigate("/interviewee");
  };

  return (
    <div className="personal-info-page">
      <NavigationBar />
      <div className="information-container">
        <h3 className="sub-title">Personal Information</h3>
        <div className="personal-info-content">
          {personalInfo ? (
            <table>
              <tbody>
                {Object.entries(personalInfoObject).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No personal information provided.</p>
          )}
        </div>
        <div className="go-back">
          <button onClick={handleBack} type="submit" className="loginBtn">
            back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
