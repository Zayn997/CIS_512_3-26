// src/TopicInput.js
import React, { useState } from "react";
import "./TopicInput.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

function TopicInput({ onGenerate }) {
  const [topic, setTopic] = useState("");
  const [background, setBackground] = useState(""); // For ReactQuill input
  const [backgroundFile, setBackgroundFile] = useState(null); // For file upload
  const [keyQuestions, setKeyQuestions] = useState([
    { text: "", importance: "medium", subQuestions: [] }, // default starting question with subQuestions array
  ]);

  const handleFileChange = (event) => {
    // Set the file to state and clear any text input for background
    setBackground("");
    setBackgroundFile(event.target.files[0]);
  };

  const handleQuillChange = (content) => {
    // Set the ReactQuill text to state and clear any file input for background
    setBackgroundFile(null);
    setBackground(content);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate({ topic, background, backgroundFile, keyQuestions });

    // You'll need to handle the form data in the onGenerate function
    // whether you want to upload the file or send the text
  };

  //key questions dropdown settings
  const handleQuestionTextChange = (value, index) => {
    // Update the text for a specific key question
    const updatedQuestions = [...keyQuestions];
    updatedQuestions[index].text = value;
    setKeyQuestions(updatedQuestions);
  };

  const handleImportanceChange = (value, index) => {
    // Update the importance for a specific key question
    const updatedQuestions = [...keyQuestions];
    updatedQuestions[index].importance = value;
    setKeyQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setKeyQuestions([
      ...keyQuestions,
      { text: "", importance: "medium", subQuestions: [] },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    // Remove a key question
    const updatedQuestions = keyQuestions.filter((_, i) => i !== index);
    setKeyQuestions(updatedQuestions);
  };
  //sub questions dropdown
  const handleAddSubQuestion = (index) => {
    const updatedQuestions = [...keyQuestions];
    updatedQuestions[index].subQuestions.push(""); // Add an empty string for the new sub-question
    setKeyQuestions(updatedQuestions);
  };

  // Handler for changing a sub-question's text
  const handleSubQuestionTextChange = (
    text,
    questionIndex,
    subQuestionIndex
  ) => {
    const updatedQuestions = [...keyQuestions];
    updatedQuestions[questionIndex].subQuestions[subQuestionIndex] = text;
    setKeyQuestions(updatedQuestions);
  };

  // Handler for removing a sub-question
  const handleRemoveSubQuestion = (questionIndex, subQuestionIndex) => {
    const updatedQuestions = [...keyQuestions];
    updatedQuestions[questionIndex].subQuestions.splice(subQuestionIndex, 1);
    setKeyQuestions(updatedQuestions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="search-box">
        <input
          type="text"
          value={topic}
          className="search-txt"
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a research group you are interested"
        />
        <button className="search-btn" type="submit">
          <i
            className="fa fa-sharp fa-solid fa-circle-check"
            aria-hidden="true"
          ></i>
        </button>
      </div>
      <div className="text-input">
        <div className="type-1">
          <div className="title-research">
            <h2>Research Background</h2>
            <div className="pop-up">
              <label htmlFor="file-upload" className="file-upload-label">
                <FontAwesomeIcon icon={faFileUpload} size="2x" />
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <ReactQuill
            className="background-input"
            placeholder="Enter research background information"
            value={background}
            onChange={handleQuillChange}
          />
        </div>

        <div className="type-2">
          <h2>Key Questions Guide</h2>
          {keyQuestions.map((question, index) => (
            <div key={index} className="question-item">
              <div className="key-item">
                <textarea
                  className="key-questions-input"
                  placeholder="Enter your questions guide one by one"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionTextChange(e.target.value, index)
                  }
                />
                <select
                  className="importance-dropdown"
                  value={question.importance}
                  onChange={(e) =>
                    handleImportanceChange(e.target.value, index)
                  }
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSubQuestion(index)}
                >
                  Add Sub-question
                </button>
              </div>
              {question.subQuestions.map((subQuestion, subIndex) => (
                <div key={subIndex} className="sub-question-item">
                  <textarea
                    className="sub-questions-input"
                    placeholder="Enter your sub-question"
                    value={subQuestion}
                    onChange={(e) =>
                      handleSubQuestionTextChange(
                        e.target.value,
                        index,
                        subIndex
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubQuestion(index, subIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
          <button
            className="loginBtn"
            type="button"
            onClick={handleAddQuestion}
          >
            Add Key Question
          </button>
        </div>
      </div>
    </form>
  );
}

export default TopicInput;
