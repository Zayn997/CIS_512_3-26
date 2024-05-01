import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AffinityDiagram from "./AffinityDiagram";
import PriorityMatrix from "./PriorityMatrix";
import ImportanceScores from "./ImportanceScores";
import Particles from "./Particles";
import NavigationBar from "./NavigationBar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import "./ResultsPage.css";

function ResultsPage() {
  const location = useLocation();
  const { answers = [] } = location.state || {};
  const [summary, setSummary] = useState("");
  const [contentVisible, setContentVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [layout, setLayout] = useState("list");

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
    return () => window.removeEventListener("scroll", handleScroll);
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
      const summaryObject = JSON.parse(data.summary);
      setSummary(summaryObject);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  const handleLayoutChange = (event, newLayout) => {
    if (newLayout !== null) {
      setLayout(newLayout);
    }
  };

  const renderSummary = (data, level = 0) => (
    <table className="summary-table">
      <tbody>
        {Object.entries(data).map(([key, value], index) => {
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

  return (
    <div className="resultsPage">
      <Particles />
      <NavigationBar />
      <ToggleButtonGroup
        orientation="vertical"
        value={layout}
        exclusive
        onChange={handleLayoutChange}
        sx={{ position: "fixed", left: 20, top: 150 }}
        className="button-container"
      >
        <ToggleButton value="list" aria-label="list">
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="module" aria-label="module">
          <ViewModuleIcon />
        </ToggleButton>
        <ToggleButton value="quilt" aria-label="quilt">
          <ViewQuiltIcon />
        </ToggleButton>
      </ToggleButtonGroup>
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
              <div className="summary-text">{renderSummary(summary)}</div>
            )}
          </div>
        </div>
        <h2 className="sub-title">Chart Diagram</h2>
        <div
          className={`chart-container ${
            contentVisible ? "slide-in visible" : "slide-in"
          } ${layout}`}
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
