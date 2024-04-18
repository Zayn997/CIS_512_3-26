import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Particles from "./Particles";
import CanvasComponent from "./CanvasComponent";
import BigNPC from "./BigNPC";
import { FaInfoCircle } from "react-icons/fa"; // Using React Icons for the 'i' icon
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  const startSurvey = () => {
    navigate("/survey");
  };

  const platformNavi = () => {
    navigate("/platform");
  };

  return (
    <div className="homepage">
      {/* <Particles /> */}
      <CanvasComponent /> {/* This is the background canvas */}
      <div className="big-npc">
        <BigNPC />
      </div>
      <section className="project-title">
        <div class="title-content">
          <h2>Smart Questionaire</h2>
          <h2>Smart Questionaire</h2>
        </div>
      </section>
      <div className="auther-container">
        <h3>Designed by Chengpu Liao, Zayn Huang, Felix Sun</h3>
      </div>
      <div className="below-icon">
        <div className="platform-page">
          <button onClick={platformNavi} className="icon-button">
            <i className="fa fa-home" aria-hidden="true"></i> {/* Home icon */}
          </button>
        </div>
        <div className="survey-button">
          <button className="start" onClick={startSurvey}>
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
