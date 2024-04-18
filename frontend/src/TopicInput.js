// src/TopicInput.js
import React, { useEffect, useState } from "react";
import "./TopicInput.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TopicInput({ onGenerate }) {
  const [topic, setTopic] = useState("");
  const [background, setBackground] = useState([]); // For ReactQuill input
  const [backgroundFile, setBackgroundFile] = useState(null); // For file upload
  const [keyQuestions, setKeyQuestions] = useState([]);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("keyQuestions");
    if (storedQuestions) {
      setKeyQuestions(JSON.parse(storedQuestions));
    } else {
      setKeyQuestions([
        { text: "", importance: "medium", subQuestions: [] },
        { text: "", importance: "medium", subQuestions: [] },
        { text: "", importance: "medium", subQuestions: [] },
        { text: "", importance: "medium", subQuestions: [] },
      ]);
    }
  }, []);

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

  const handleBackgroundChange = (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      const sentences =
        event.target.value.trim().match(/[^.!?]+[.!?]*\s*/g) || [];
      setBackground([...background, ...sentences]);
      event.target.value = ""; // Clear the input field
    }
  };

  const removeBackgroundSentence = (indexToRemove) => {
    setBackground(background.filter((_, index) => index !== indexToRemove));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const items = Array.from(keyQuestions);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    //store in global
    setKeyQuestions(items);
    localStorage.setItem("keyQuestions", JSON.stringify(items));
  };

  const handleSave = (event) => {
    event.preventDefault();
    //save to local varible
    const topicData = { topic, background, backgroundFile, keyQuestions };
    localStorage.setItem("topicData", JSON.stringify(topicData));
    // remind you all the data being saved
    alert("Topic data saved successfully!");
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <form onSubmit={handleSave}>
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
              // className="fa fa-sharp fa-solid fa-circle-check"
              className="fa-solid fa-floppy-disk"
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
            <div className="background-section">
              <textarea
                className="background-text"
                type="text"
                onKeyDown={handleBackgroundChange}
                placeholder="Paste your text here or press enter after each sentence..."
              />
              <div className="background-container">
                {background.map((sentence, index) => (
                  <div key={index} className="background-tag">
                    {sentence}
                    <button
                      className="loginBtn"
                      type="button"
                      onClick={() => removeBackgroundSentence(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="type-2">
            <h2>Key Questions Guide</h2>
            <Droppable droppableId="questions-bar">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ overflow: "scroll", maxHeight: "500px" }}
                  // className="type-2"
                >
                  {keyQuestions.map((question, index) => (
                    <Draggable
                      key={index}
                      draggableId={`draggable-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className="question-item"
                        >
                          <div className="key-item">
                            <textarea
                              className="key-questions-input"
                              placeholder="Enter your key question"
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
                              <option className="high-option" value="high">
                                High
                              </option>
                              <option className="medium-option" value="medium">
                                Medium
                              </option>
                              <option className="low-option" value="low">
                                Low
                              </option>
                            </select>
                            <button
                              type="button"
                              className="remove-sub"
                              onClick={() => handleRemoveQuestion(index)}
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              className="add-sub"
                              onClick={() => handleAddSubQuestion(index)}
                            >
                              Add Sub-question
                            </button>
                          </div>
                          {question.subQuestions.map(
                            (subQuestion, subIndex) => (
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
                                  className="remove-sub"
                                  onClick={() =>
                                    handleRemoveSubQuestion(index, subIndex)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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
    </DragDropContext>
  );
}

export default TopicInput;
