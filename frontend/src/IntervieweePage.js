import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SentimentNPC from "./SentimentNPC";
import ReactQuill from "react-quill";
import Particles from "./Particles";
// import CanvasComponent from "./CanvasComponent";
import NavigationBar from "./NavigationBar";
import QuestionsDisplay from "./QuestionsDisplay";
import PersonalInfoInput from "./PersonalInfoInput";
import { ProgressBar } from "react-bootstrap";
import "./IntervieweePage.css";

function IntervieweePage() {
  const [topicData, setTopicData] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSentiment, setCurrentSentiment] = useState(0.5);
  const [currentInput, setCurrentInput] = useState("");
  const [keywordsCount, setKeywordsCount] = useState({});
  const [content1Visible, setContent1Visible] = useState(false);
  const [content2Visible, setContent2Visible] = useState(false);
  const [greetingsVisible, setGreetingsVisible] = useState(false);
  const [keywordsSummaryVisible, setKeywordsSummaryVisible] = useState(false);
  const TOTAL_QUESTIONS = 3;

  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const content1Position = document
        .querySelector(".content-1")
        .getBoundingClientRect().top;
      const content2Position = document
        .querySelector(".content-2")
        .getBoundingClientRect().top;
      const greetingsPosition = document
        .querySelector(".Greetings")
        .getBoundingClientRect().top;
      const keywordsSummaryPosition = document
        .querySelector(".keywords-summary")
        .getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (content1Position < windowHeight) {
        setContent1Visible(true);
      }

      if (content2Position < windowHeight) {
        setContent2Visible(true);
      }

      if (greetingsPosition < windowHeight) {
        setGreetingsVisible(true);
      }

      if (keywordsSummaryPosition < windowHeight) {
        setKeywordsSummaryVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //get data from local store
  useEffect(() => {
    const storedTopicData = JSON.parse(localStorage.getItem("topicData"));
    if (storedTopicData) {
      setTopicData(storedTopicData);
    }
  }, []);

  const fetchGeneratedQuestions = async (topicData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generateQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicData }),
      });
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0); // Reset the question index
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const fetchFollowUpQuestions = async (topicData, last_answer) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generateQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicData, // Make sure 'topic' is defined in your state and is updated appropriately
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
      const newKeywordsWithColor = newKeywords.reduce((acc, keyword) => {
        // If keyword is already in the state, use the existing color, otherwise generate a new color
        acc[keyword] = keywordsCount[keyword] || {
          count: 0,
          color: getRandomColor(),
        };
        acc[keyword].count += 1;
        return acc;
      }, {});

      setKeywordsCount({ ...keywordsCount, ...newKeywordsWithColor });

      setCurrentSentiment(sentimentScore); // Update the current sentiment for the NPC
      setCurrentInput(""); // Clear the input field
      // Check if we have asked less than 5 questions, if so, fetch a follow-up question
      if (newAnswers.length < 10) {
        await fetchFollowUpQuestions(lastAnswer);
      } else if (newAnswers.length >= TOTAL_QUESTIONS) {
        // Check if we have reached the total number of questions
        // finishSurvey();
      } else if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log("End of questions");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1]); // Update the current question
    } else {
      console.log("End of questions");
    }
    fetchGeneratedQuestions(topicData);
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
    <div className="Intervieweepage">
      <Particles />
      {/* <CanvasComponent /> */}
      <NavigationBar />
      <div className="Interviewee-container">
        <div
          className={`Greetings ${
            greetingsVisible ? "fade-in visible" : "fade-in"
          }`}
        >
          <PersonalInfoInput
            className="type-3"
            onGreetingGenerated={setGreeting}
          />
          {greeting && (
            <div className="alert alert-success mt-3">{greeting}</div>
          )}
        </div>
        <div
          className={`content-1 ${
            content1Visible ? "fade-in visible" : "fade-in"
          }`}
        >
          <div className="questions-display-wrapper">
            <button
              className="loginBtn"
              onClick={() => topicData && fetchGeneratedQuestions(topicData)}
            >
              Generate Questions
            </button>
            <QuestionsDisplay
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={setCurrentQuestion}
            />
          </div>
        </div>
        <div
          className={`content-2 ${
            content2Visible ? "fade-in visible" : "fade-in"
          }`}
        >
          <div className="current-question">
            {/* can be commended */}
            {/* <h3 className="sub-title">Current Question</h3> */}
            <div className="current-q-content">
              <p className="current-q">{currentQuestion}</p>
              <div className="tail"></div>
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
            <div className="button-container">
              <button className="loginBtn-skip" onClick={handleSkipQuestion}>
                Skip Question
              </button>
              <button className="loginBtn" onClick={handleSubmitAnswer}>
                Submit Answer
              </button>
            </div>
            {/* Progress Bar */}
            {questions.length > 0 && (
              <ProgressBar
                className="custom-progress-bar"
                now={(answers.length / TOTAL_QUESTIONS) * 100}
                label={`${answers.length} / ${TOTAL_QUESTIONS}`}
              />
            )}
          </div>
        </div>
        <div
          className={`keywords-summary ${
            keywordsSummaryVisible ? "fade-in visible" : "fade-in"
          }`}
        >
          <div className="keywords-title">
            <h3 className="sub-title">Keywords Summary</h3>
          </div>
          <div className="keywords-container">
            <div className="keywords-section">
              {Object.entries(keywordsCount).map(([keyword, data]) => (
                <div
                  key={keyword}
                  className="keyword-item"
                  style={{ backgroundColor: data.color }}
                >
                  {keyword}: {data.count}
                </div>
              ))}
            </div>
          </div>
        </div>

        {answers.length === TOTAL_QUESTIONS && (
          <button className="loginBtn" onClick={finishSurvey}>
            Finish Survey
          </button>
        )}
      </div>
    </div>
  );
}

export default IntervieweePage;
