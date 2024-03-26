import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage"; // Create a MainPage component for the main page content
import SurveyPage from "./SurveyPage"; // Create a SurveyPage component for the survey generation page
import ResultsPage from "./ResultsPage"; // Create a ResultsPage component for the results page
import PersonalInfo from "./PersonalInfo";
import NavigationBar from "./NavigationBar";
import Platform from "./Platform";
import SignIn from "./SignIn";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/personalInfo" element={<PersonalInfo />} />
          <Route path="/platform" element={<Platform />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
