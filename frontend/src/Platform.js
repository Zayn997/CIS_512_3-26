import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import "./Platform.css"; // This will be your CSS file for styling
import CompletionCircle from "./CompletionCircle";
import { useNavigate } from "react-router-dom";
const Platform = () => {
  const [surveyStats, setSurveyStats] = useState({
    surveysSent: 0,
    responsesReceived: 0,
    responsesPending: 0,
    averageTime: "0m",
    completionRate: "0%",
    lastResponseTime: "Not available",
    totalResponses: 0,
  });
  const navigate = useNavigate();

  const handleClick = () => {
    // This function will be called when the back icon is clicked
    navigate("/survey"); // Adjust the path as needed for your sign-in route
  };

  // Here you would fetch the real data from the server using useEffect
  useEffect(() => {
    // Fetch data from your API and update the state
    // Assuming you have an endpoint to get survey stats
    fetch("http://127.0.0.1:5000/getSurveyStats")
      .then((response) => response.json())
      .then((data) =>
        setSurveyStats({
          surveysSent: data.surveysSent,
          responsesReceived: data.responsesReceived,
          responsesPending: data.responsesPending,
          averageTime: data.averageTime,
          completionRate: data.completionRate,
          lastResponseTime: data.lastResponseTime,
          totalResponses: data.totalResponses,
        })
      )
      .catch((error) => {
        console.error("Error fetching survey stats:", error);
      });
  }, []);

  return (
    <div className="platform-container">
      <div className="sidebar">
        <SideBar />
      </div>
      <h1>Projects</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button className="search-btn" type="submit">
          <i className="fa fa-sharp fa-solid fa-search" aria-hidden="true"></i>
        </button>
      </div>
      <div className="project-card">
        <h2>Demo Interview Project</h2>
        <div className="stat-grid">
          <div className="stat-send">
            <span>Survey Send</span>
            <strong>{surveyStats.surveysSent}</strong>
          </div>
          <div className="stat-response">
            <span>Response Received</span>
            <strong>{surveyStats.responsesReceived}</strong>
          </div>
          <div className="stat-pend">
            <span>Response Pending</span>
            <strong>{surveyStats.responsesPending}</strong>
          </div>
          <div className="semi-card">
            <div className="first-three">
              <div className="stat">
                <span>Average Time</span>
                <strong>{surveyStats.averageTime}</strong>
              </div>
              <div className="stat">
                <span>Completion Rate</span>
                <div className="completion-rate">
                  <div className="completion-circle">
                    <span>{surveyStats.completionRate}</span>
                  </div>
                </div>
              </div>
              <div className="stat">
                <span>Last Responses</span>
                <strong>{surveyStats.lastResponseTime}</strong>
              </div>
            </div>
            <div className="last-one">
              <div className="stat-1">
                <span>Total Responses</span>
                <strong>{surveyStats.totalResponses}%</strong>
              </div>
            </div>
          </div>
        </div>
        <button className="add-project-btn" onClick={handleClick}>
          Add New Project{" "}
        </button>
      </div>
    </div>
  );
};

export default Platform;
