import React, { useState } from "react";
import "./AffinityDiagram.css";

function AffinityDiagram({ answers }) {
  const [affinityDiagramData, setAffinityDiagramData] = useState(null);

  const fetchAffinityDiagram = async () => {
    const user_answers = answers.map((answer) => answer.text);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/generateAffinityDiagram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: user_answers }),
        }
      );
      const data = await response.json();

      if (
        data.affinity_diagram &&
        Array.isArray(data.affinity_diagram.Categories)
      ) {
        setAffinityDiagramData(data.affinity_diagram.Categories);
      } else {
        console.error("Invalid format for affinity diagram data:", data);
      }
    } catch (error) {
      console.error("Error fetching affinity diagram:", error);
    }
  };

  return (
    <div className="affinity-diagram-section">
      <button className="loginBtn" onClick={fetchAffinityDiagram}>
        Generate Affinity Diagram
      </button>
      {affinityDiagramData && (
        <div className="affinity-diagram">
          {affinityDiagramData.map((category, index) => (
            <div key={index} className="category">
              <h2 className="category-title">{category.Category}</h2>
              <ul className="points">
                {category.Points.map((point, pointIndex) => (
                  <li key={pointIndex} className="point">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AffinityDiagram;
