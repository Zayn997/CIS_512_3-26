import React, { useState, useEffect } from "react";
import TopicInput from "./TopicInput";
import QuestionsDisplay from "./QuestionsDisplay";
import SentimentNPC from "./SentimentNPC";
import "./App.css";
import Particles from "./Particles";
import CanvasComponent from "./CanvasComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BubbleEffect from "./BubbleEffect";
import PersonalInfoInput from "./PersonalInfoInput";
import BigNPC from "./BigNPC";
import AffinityDiagram from "./AffinityDiagram";
import ComparisonChart from "./ComparisonChart";
import NavigationBar from "./NavigationBar"; // Make sure the path is correct

// import "./demo.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentSentiment, setCurrentSentiment] = useState(0.5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [keywordsCount, setKeywordsCount] = useState({});
  const [summary, setSummary] = useState(""); // 用于存储摘要的状态
  const [contentVisible, setContentVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [priorityMatrix, setPriorityMatrix] = useState("");
  const [affinityDiagram, setAffinityDiagram] = useState(null);

  // Function to fetch generated questions from the backend based on the topic
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
      setQuestions(data.allQuestions);
      setCurrentQuestionIndex(0); // Reset the question index
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
    try {
      const sentimentResponse = await fetch(
        "http://127.0.0.1:5000/analyzeSentiment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: currentInput }),
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
          body: JSON.stringify({ answer: currentInput }),
        }
      );
      const keywordData = await keywordResponse.json();
      const newKeywords = keywordData.keywords;
      updateKeywordsCount(newKeywords);

      // Update answers and keywords count
      setAnswers([
        ...answers,
        { text: currentInput, sentiment: sentimentScore },
      ]);
      const newCount = { ...keywordsCount };
      newKeywords.forEach((keyword) => {
        newCount[keyword] = (newCount[keyword] || 0) + 1;
      });
      setKeywordsCount(newCount);

      setCurrentSentiment(sentimentScore); // Update the current sentiment for the NPC
      setCurrentInput(""); // Clear the input field

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log("End of questions");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // summary
  const handleGenerateSummary = async () => {
    // Construct the array of texts from the answers
    const allAnswersTexts = answers.map((answerObj) => answerObj.text);

    try {
      const response = await fetch("http://127.0.0.1:5000/summarizeAnswers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the array of texts
        body: JSON.stringify({ text: allAnswersTexts }),
      });
      const data = await response.json();
      setSummary(data.summary); // Update the state with the summary
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  const fetchPriorityMatrix = async () => {
    const user_answers = answers.map((answerObj) => answerObj.text);

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

  const fetchAffinityDiagram = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/generateAffinityDiagram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: answers.map((answer) => answer.text) }),
        }
      );
      const data = await response.json();
      setAffinityDiagram(data.affinity_diagram);
    } catch (error) {
      console.error("Error fetching affinity diagram:", error);
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

  useEffect(() => {
    const handleScroll = () => {
      const contentPosition = document
        .querySelector(".main-content")
        .getBoundingClientRect().top;
      const summaryPosition = document
        .querySelector(".summary-section")
        .getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (contentPosition < windowHeight) {
        setContentVisible(true);
      }

      if (summaryPosition < windowHeight) {
        setSummaryVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Particles />
      <CanvasComponent /> {/* This is the background canvas */}
      <NavigationBar />
      <div className="big-npc">
        <BigNPC />
      </div>
      <section className=" project-title">
        <div class="title-content">
          <h2>Smart Questionaire</h2>
          <h2>Smart Questionaire</h2>
        </div>
      </section>
      <div className="auther-container">
        <h2>Designed by Chengpu Liao, Zayn Huang, Felix Sun</h2>
      </div>
      <div
        className={`main-content ${
          contentVisible ? "slide-in visible" : "slide-in"
        }`}
      >
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
            <h2>Current Question</h2>
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
            <h2>Keywords Summary</h2>
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
        <div
          className={`summary-section ${
            summaryVisible ? "slide-in visible" : "slide-in"
          }`}
        >
          <div className="summary-title">
            {currentQuestionIndex >= questions.length - 1 && (
              <button className="loginBtn" onClick={handleGenerateSummary}>
                Generate Summary
              </button>
            )}
          </div>
          <div className="summary-content">
            {summary && (
              <div className="summary-text" data-lit-hue="210">
                {summary}
                <BubbleEffect className="summary-bubble-effect" />
              </div>
            )}
          </div>
        </div>
        <div className="matrix">
          <button onClick={fetchPriorityMatrix}>
            Generate Priority Matrix
          </button>
          {priorityMatrix && <div>{priorityMatrix}</div>}
        </div>
        <div className="affinity-diagram">
          <button onClick={fetchAffinityDiagram}>
            Generate Affinity Diagram
          </button>
          {affinityDiagram && <AffinityDiagram data={affinityDiagram} />}
        </div>
        <div className="compare-chart">
          <ComparisonChart answers={answers.map((answer) => answer.text)} />
        </div>
      </div>
    </div>
  );
}

export default App;
