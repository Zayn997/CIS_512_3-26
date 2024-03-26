import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopicInput from "./TopicInput";
import QuestionsDisplay from "./QuestionsDisplay";
import SentimentNPC from "./SentimentNPC";
import PersonalInfoInput from "./PersonalInfoInput";
import ReactQuill from "react-quill";
import Particles from "./Particles";
import CanvasComponent from "./CanvasComponent";
import "react-quill/dist/quill.snow.css";
import NavigationBar from "./NavigationBar";
import "./SurveyPage.css";

function SurveyPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSentiment, setCurrentSentiment] = useState(0.5);
  const [currentInput, setCurrentInput] = useState("");
  const [keywordsCount, setKeywordsCount] = useState({});

  const navigate = useNavigate();

  const fetchGeneratedQuestions = async (topic) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generateQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0); // Reset the question index
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const fetchFollowUpQuestions = async (topic, last_answer) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generateQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic, // Make sure 'topic' is defined in your state and is updated appropriately
          last_answer,
          ask_for_details: true,
          // Include any other parameters if needed
        }),
      });
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestion(data.questions[0]); // Set the first follow-up question as the current question
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const updateKeywordsCount = (newKeywords) => {
    const updatedCount = { ...keywordsCount };
    newKeywords.forEach((keyword) => {
      updatedCount[keyword] = (updatedCount[keyword] || 0) + 1;
    });
    setKeywordsCount(updatedCount);
  };

  // Function to handle answer submission, sentiment analysis, and keyword extraction
  const handleSubmitAnswer = async () => {
    const lastAnswer = currentInput;

    try {
      const sentimentResponse = await fetch(
        "http://127.0.0.1:5000/analyzeSentiment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: lastAnswer }),
        }
      );
      const sentimentData = await sentimentResponse.json();
      const sentimentScore = parseFloat(sentimentData.sentiment);

      const keywordResponse = await fetch(
        "http://127.0.0.1:5000/extractKeywords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer: lastAnswer }),
        }
      );
      const keywordData = await keywordResponse.json();
      const newKeywords = keywordData.keywords;
      updateKeywordsCount(newKeywords);

      // Update answers and keywords count
      const newAnswers = [
        ...answers,
        { text: lastAnswer, sentiment: sentimentScore },
      ];
      setAnswers(newAnswers);
      const newCount = { ...keywordsCount };
      newKeywords.forEach((keyword) => {
        newCount[keyword] = (newCount[keyword] || 0) + 1;
      });
      setKeywordsCount(newCount);

      setCurrentSentiment(sentimentScore); // Update the current sentiment for the NPC
      setCurrentInput(""); // Clear the input field
      // Check if we have asked less than 5 questions, if so, fetch a follow-up question
      if (newAnswers.length < 2) {
        // Since we're checking before adding the current answer, use < 4
        await fetchFollowUpQuestions(lastAnswer);
      }
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log("End of questions");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Function to get a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const finishSurvey = () => {
    navigate("/results", { state: { answers } });
  };

  return (
    <div className="surveypage">
      <Particles />
      <CanvasComponent /> {/* This is the background canvas */}
      <NavigationBar />
      <div className="survey-container">
        <div className="content-1">
          <div className="topic-input-wrapper">
            <TopicInput onGenerate={fetchGeneratedQuestions} />
          </div>
          <div className="Greetings">
            <PersonalInfoInput className="type-3" />
          </div>
          <div className="questions-display-wrapper">
            <QuestionsDisplay
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={setCurrentQuestion}
            />
          </div>
        </div>
        <div className="content-2">
          <div className="current-question">
            <h3 className="sub-title">Current Question</h3>
            <div className="current-q-content">
              <p className="current-q">{currentQuestion}</p>
            </div>
          </div>
          <div className="sentiment-container">
            <SentimentNPC sentiment={currentSentiment} />
          </div>
          <div className="chatbox">
            <div className="chat-area">
              <ReactQuill
                className="react-quill-container"
                onChange={setCurrentInput}
                value={currentInput}
                placeholder="Type here and feel free to express your experience..."
              ></ReactQuill>
            </div>
            <button className="loginBtn" onClick={handleSubmitAnswer}>
              Submit Answer
            </button>
          </div>
        </div>

        <div className="keywords-summary">
          <div className="keywords-title">
            <h3 className="sub-title">Keywords Summary</h3>
          </div>
          <div className="keywords-container">
            <div className="keywords-section">
              {Object.entries(keywordsCount).map(([keyword, count]) => (
                <div
                  key={keyword}
                  className="keyword-item"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {keyword}: {count}
                </div>
              ))}
            </div>
          </div>
        </div>
        {currentQuestionIndex === questions.length - 1 && (
          <button className="loginBtn" onClick={finishSurvey}>
            Finish Survey
          </button>
        )}
      </div>
    </div>
  );
}

export default SurveyPage;
