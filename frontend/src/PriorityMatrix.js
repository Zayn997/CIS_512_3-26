import React, { useState } from "react";
import "./PriorityMatrix.css";

function extractTextFromHtml(htmlString) {
  const tempDivElement = document.createElement("div");
  // Assign the HTML string to the innerHTML of the div
  tempDivElement.innerHTML = htmlString;
  // Use textContent to get the text version, which strips off all HTML tags
  return tempDivElement.textContent || tempDivElement.innerText || "";
}

function PriorityMatrix({ answers }) {
  const [priorityMatrix, setPriorityMatrix] = useState(null);

  const fetchPriorityMatrix = async () => {
    // Extract text from HTML answers
    const user_answers = answers.map((answer) =>
      extractTextFromHtml(answer.text)
    );
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
