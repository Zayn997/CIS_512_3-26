import React, { useState } from "react";
import "./PriorityMatrix.css";

function PriorityMatrix({ answers }) {
  const [priorityMatrix, setPriorityMatrix] = useState(null);

  const fetchPriorityMatrix = async () => {
    const user_answers = answers.map((answer) => answer.text);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/generatePriorityMatrix",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: user_answers }),
        }
      );
      const data = await response.json();
      setPriorityMatrix(data.priorityMatrix);
    } catch (error) {
      console.error("Error fetching priority matrix:", error);
    }
  };

  return (
    <div className="priority-matrix-section">
      <button className="loginBtn" onClick={fetchPriorityMatrix}>
        Generate Priority Matrix
      </button>
      {priorityMatrix && (
        <div className="priority-matrix">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Tasks</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priorityMatrix).map(
                ([category, tasks], index) => (
                  <tr key={index}>
                    <td>{category}</td>
                    <td>{Array.isArray(tasks) ? tasks.join(", ") : ""}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PriorityMatrix;
