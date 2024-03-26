import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import "./PersonalInfoInput.css"; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function PersonalInfoInput() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    gender: "",
    email: "",
    birthDate: "",
    other: "",
  });
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/generategreetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personalInfo }),
      });
      const data = await response.json();
      setGreeting(data.personalInfo);
    } catch (error) {
      console.error("Failed to fetch greeting:", error);
    }
    navigate("/personalInfo", { state: { personalInfo } });
  };

  return (
    <div className="container">
      <h2>Personal Information</h2>
      <div className="tooltip-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Zayn"
              value={personalInfo.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <input
              type="text"
              className="form-control"
              id="gender"
              name="gender"
              placeholder="Female/Male/Trans/Others"
              value={personalInfo.gender}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="...@.com"
              value={personalInfo.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="birthDate" className="form-label">
              Birth Date
            </label>
            <input
              type="date"
              className="form-control"
              id="birthDate"
              name="birthDate"
              value={personalInfo.birthDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="other" className="form-label">
              Other
            </label>
            <textarea
              className="form-control"
              id="other"
              name="other"
              value={personalInfo.other}
              placeholder="any comments"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Info
          </button>
        </form>
        <span className="tooltip-text">
          Please enter your personal information
        </span>
      </div>
      {greeting && <div className="alert alert-success mt-3">{greeting}</div>}
    </div>
  );
}

export default PersonalInfoInput;
