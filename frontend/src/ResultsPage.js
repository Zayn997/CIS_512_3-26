import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AffinityDiagram from "./AffinityDiagram";
import PriorityMatrix from "./PriorityMatrix";
import "./ResultsPage.css"; // Make sure to create this CSS file for styling
import BubbleEffect from "./BubbleEffect";
import Particles from "./Particles";
import NavigationBar from "./NavigationBar";
import ImportanceScores from "./ImportanceScores";

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
      const summaryObject = JSON.parse(data.summary); // Parse the summary string into an object
      setSummary(summaryObject);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  const renderSummary = (data, level = 0) => {
    return (
      <table className="summary-table">
        <tbody>
          {Object.entries(data).map(([key, value], index) => {
            // Check if the value is an object, if so, render it recursively
            const isObject = typeof value === "object" && value !== null;
            return (
              <tr key={index} className={"level-" + level}>
                <td>{key}</td>
                <td>{isObject ? renderSummary(value, level + 1) : value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="rusultspage">
      <Particles />
      {/* <CanvasComponent />  */}
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
              <div className="summary-text">
                {renderSummary(summary)}
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
            <ImportanceScores answers={answers} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
