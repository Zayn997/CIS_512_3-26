// src/TopicInput.js
import React, { useEffect, useState } from "react";
import "./TopicInput.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function TopicInput({ darkMode, onGenerate }) {
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
        event.target.value.trim().match(/[^.!?,]+[.!?]*\s*/g) || [];
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

  const getDarkModeClass = () => (darkMode ? "dark-mode" : "");

  return (
    <div className={`topic-input ${getDarkModeClass()}`}>
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
                              {/* <textarea
                              className="key-questions-input"
                              placeholder="Enter your key question"
                              value={question.text}
                              onChange={(e) =>
                                handleQuestionTextChange(e.target.value, index)
                              }
                            /> */}
                              <Stack direction="row" spacing={2}>
                                <TextField
                                  required
                                  id="outlined-required"
                                  className="key-questions-input"
                                  style={{ width: "70%" }}
                                  label="Required"
                                  value={question.text}
                                  onChange={(e) =>
                                    handleQuestionTextChange(
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                                <FormControl className="importance-dropdown">
                                  <InputLabel id="demo-simple-select-label">
                                    Importance
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={question.importance}
                                    label="Importance"
                                    onChange={(e) =>
                                      handleImportanceChange(
                                        e.target.value,
                                        index
                                      )
                                    }
                                  >
                                    <MenuItem className="low-option" value={10}>
                                      10
                                    </MenuItem>
                                    <MenuItem
                                      className="medium-option"
                                      value={50}
                                    >
                                      50
                                    </MenuItem>
                                    <MenuItem
                                      className="high-option"
                                      value={90}
                                    >
                                      100
                                    </MenuItem>
                                  </Select>
                                </FormControl>

                                {/* <select
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
                            </select> */}
                                {/* <button
                              type="button"
                              className="remove-sub"
                              onClick={() => handleRemoveQuestion(index)}
                            >
                              Remove
                            </button> */}

                                <Button
                                  variant="outlined"
                                  startIcon={<DeleteIcon />}
                                  type="button"
                                  className="remove-sub"
                                  onClick={() => handleRemoveQuestion(index)}
                                  sx={{
                                    color: "white",
                                    borderColor: "#ff6868",
                                    background: "#ff6868",
                                  }}
                                >
                                  Remove
                                </Button>

                                <Button
                                  type="button"
                                  className="add-sub"
                                  onClick={() => handleAddSubQuestion(index)}
                                >
                                  +
                                </Button>
                              </Stack>
                            </div>
                            {question.subQuestions.map(
                              (subQuestion, subIndex) => (
                                <div
                                  key={subIndex}
                                  className="sub-question-item"
                                >
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
                                  {/* <button
                                    type="button"
                                    className="remove-sub"
                                    onClick={() =>
                                      handleRemoveSubQuestion(index, subIndex)
                                    }
                                  >
                                    Remove
                                  </button> */}
                                  <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    type="button"
                                    className="remove-sub"
                                    onClick={() =>
                                      handleRemoveSubQuestion(index, subIndex)
                                    }
                                    sx={{
                                      color: "white",
                                      borderColor: "#ff6868",
                                      background: "#ff6868",
                                    }}
                                  ></Button>
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
              <div className="buttom-bar">
                <button
                  className="loginBtn"
                  type="button"
                  onClick={handleAddQuestion}
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
                <button className="loginBtn" type="submit">
                  <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </DragDropContext>
    </div>
  );
}

export default TopicInput;
