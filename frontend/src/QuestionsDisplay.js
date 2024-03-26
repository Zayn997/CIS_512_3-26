// src/QuestionsDisplay.js
import React from "react";
import "./QuestionsDisplay.css"; // Make sure to create this CSS file

function QuestionsDisplay({
  questions,
  // currentQuestionIndex,
  onQuestionSelect,
}) {
  // const currentSet = questions[currentQuestionIndex] || [];

  return (
    <div className="displayed-questions">
      <div className="title">
        <h3 className="sub-title">Generated Questions</h3>
      </div>
      <div className="main">
        {questions.map((question, index) => (
          <div
            key={index}
            className="question-frame" // 你需要定义这个样式
            onClick={() => onQuestionSelect(question)}
          >
            <div className="question-item">{question}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionsDisplay;
