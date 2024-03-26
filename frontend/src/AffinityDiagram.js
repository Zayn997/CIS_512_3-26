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
        typeof data.affinity_diagram.AffinityDiagram === "object"
      ) {
        const diagramData = Object.entries(
          data.affinity_diagram.AffinityDiagram
        ).map(([mainCategory, challenges]) => ({
          mainCategory,
          challenges: challenges.map((challenge) => ({
            category: challenge.Category,
            points: challenge.Points,
          })),
        }));

        setAffinityDiagramData(diagramData);
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
          {affinityDiagramData.map((mainCategoryGroup, index) => (
            <div key={index} className="main-category">
              <h2 className="main-category-title">
                {mainCategoryGroup.mainCategory}
              </h2>
              <ul className="points">
                {mainCategoryGroup.points.map((point, pointIndex) => (
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
