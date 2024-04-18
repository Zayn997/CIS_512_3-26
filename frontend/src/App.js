import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import ResultsPage from "./ResultsPage"; // Create a ResultsPage component for the results page
import PersonalInfo from "./PersonalInfo";
import NavigationBar from "./NavigationBar";
import Platform from "./Platform";
import SignIn from "./SignIn";
import ResearcherPage from "./ResearcherPage";
import IntervieweePage from "./IntervieweePage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/main" element={<MainPage />} />
          {/* <Route path="/survey" element={<SurveyPage />} /> */}
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/personalInfo" element={<PersonalInfo />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/Researcher" element={<ResearcherPage />} />
          <Route path="/interviewee" element={<IntervieweePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
