import React, { useState } from "react";
import "./ImportanceScores.css";

function ImportanceScores({ answers }) {
  const [importanceScores, setImportanceScores] = useState(null);

  const fetchImportanceScores = async () => {
    const user_answers = answers.map((answer) => ({
      question: answer.question,
      answer: answer.text,
    }));
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/calculateImportanceScores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: user_answers }),
        }
      );
      const scores = await response.json();
      setImportanceScores(scores);
    } catch (error) {
      console.error("Error fetching importance scores:", error);
    }
  };

  return (
    <div className="importance-scores-section">
      <button className="loginBtn" onClick={fetchImportanceScores}>
        Generate Importance Scores
      </button>
      {importanceScores && (
        <div className="importance-scores">
          {importanceScores.map((item, index) => (
            <div key={index} className="score-item">
              <h3>
                Question {index + 1}: {item.question}
              </h3>
              <p>Importance Score: {item.importanceScore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImportanceScores;
