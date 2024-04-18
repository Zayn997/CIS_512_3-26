import React from "react";
import "./SummaryDiagram.css"; // Create this CSS file to style your diagram

const SummaryDiagram = ({ summaryData }) => {
  const renderSummary = (data) => {
    return Object.entries(data).map(([key, value]) => {
      // Check if the value is an object and render recursively
      if (typeof value === "object" && value !== null) {
        return (
          <div key={key} className="summary-item">
            <h3 className="summary-key">{key}</h3>
            <div className="summary-value">{renderSummary(value)}</div>
          </div>
        );
      }
      // Render the basic key-value pair
      return (
        <div key={key} className="summary-item">
          <span className="summary-key">{key}</span>:{" "}
          <span className="summary-value">{value}</span>
        </div>
      );
    });
  };

  return <div className="summary-diagram">{renderSummary(summaryData)}</div>;
};

export default SummaryDiagram;
