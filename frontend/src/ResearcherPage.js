import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopicInput from "./TopicInput";
import Particles from "./Particles";
// import CanvasComponent from "./CanvasComponent";
import MouseEffect from "./MouseEffect";
import NavigationBar from "./NavigationBar";

import "./ResearcherPage.css";

function ResearcherPage() {
  const navigate = useNavigate();
  const [generatedPath, setGeneratedPath] = useState("");

  const handleGoToIntervieweePage = () => {
    navigate("/interviewee");
  };

  const handleGeneratePath = () => {
    // Example path generation, you can customize this according to your needs
    const path = "/interviewee";
    setGeneratedPath(path);
  };

  return (
    <div className="Researcherpage">
      {/* <Particles /> */}
      {/* <CanvasComponent /> */}
      <MouseEffect />
      <NavigationBar />
      <div className="Researcherpage-container">
        <div className="content-1">
          <div className="topic-input-wrapper">
            <TopicInput />
            <div className="interview-navi">
              <button className="loginBtn" onClick={handleGeneratePath}>
                Generate Link
              </button>
              <p>
                {generatedPath && `${window.location.origin}${generatedPath}`}
              </p>
              {generatedPath && (
                <div className="gotointerviewee">
                  <button
                    className="loginBtn"
                    onClick={handleGoToIntervieweePage}
                  >
                    Go to Interviewee Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearcherPage;
