import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AffinityDiagram from "./AffinityDiagram";
import ComparisonChart from "./ComparisonChart";
import PriorityMatrix from "./PriorityMatrix";
import "./ResultsPage.css"; // Make sure to create this CSS file for styling
import BubbleEffect from "./BubbleEffect";
import Particles from "./Particles";
import CanvasComponent from "./CanvasComponent";
import NavigationBar from "./NavigationBar";

function ResultsPage() {
  const location = useLocation();
  const { answers = [] } = location.state || {}; // Add this line
  const [summary, setSummary] = useState("");
  const [contentVisible, setContentVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const contentPosition = document
        .querySelector(".chart-container")
        .getBoundingClientRect().top;
      const summaryPosition = document
        .querySelector(".summary-section")
        .getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (contentPosition < windowHeight) {
        setContentVisible(true);
      }

      if (summaryPosition < windowHeight) {
        setSummaryVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [answers]);

  const handleGenerateSummary = async () => {
    const allAnswersTexts = answers.map((answerObj) => answerObj.text);

    try {
      const response = await fetch("http://127.0.0.1:5000/summarizeAnswers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: allAnswersTexts }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
    <div className="rusultspage">
      <Particles />
      <CanvasComponent /> {/* This is the background canvas */}
      <NavigationBar />
      <div className="result-container">
        <div
          className={`summary-section ${
            summaryVisible ? "slide-in visible" : "slide-in"
          }`}
        >
          <div className="summary-title">
            <button className="loginBtn" onClick={handleGenerateSummary}>
              Generate Summary
            </button>
          </div>
          <div className="summary-content">
            {summary && (
              <div className="summary-text" data-lit-hue="210">
                {summary}
                <BubbleEffect className="summary-bubble-effect" />
              </div>
            )}
          </div>
        </div>
        <h2 className="sub-title">Chart Diagram</h2>
        <div
          className={`chart-container ${
            contentVisible ? "slide-in visible" : "slide-in"
          }`}
        >
          <div className="chart">
            <AffinityDiagram answers={answers} />
          </div>
          <div className="chart">
            <PriorityMatrix answers={answers} />
          </div>
          <div className="chart">
            <ComparisonChart answers={answers} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
