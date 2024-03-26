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
  const [keyQuestions, setKeyQuestions] = useState("");

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
          <h2>Questions Guide</h2>
          <ReactQuill
            className="key-questions-input"
            placeholder="Enter key questions from the interview guide"
            value={keyQuestions}
            onChange={setKeyQuestions}
          />
        </div>
      </div>
    </form>
  );
}

export default TopicInput;
