// SignIn.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SentimentNPC from "./SentimentNPC";
import "./SignIn.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (event) => {
    event.preventDefault();
    // Dummy sign-in: Navigate to platform if any email and password are entered
    if (email && password) {
      navigate("/platform");
    } else {
      alert("Please enter both email and password");
    }
  };

  // Define your sign in functions here
  const handleSignInGoogle = () => {
    // Sign in with Google logic
  };

  const handleSignInFacebook = () => {
    // Sign in with Facebook logic
  };

  return (
    <div className="signin-container">
      <div className="sentiment-container">
        <SentimentNPC />
      </div>
      <div className="form-container">
        <h1 className="project-name">Smart Survey</h1>
        <h2 className="signin-title">Sign In</h2>
        <h6 className="instruction">
          Enter your email and password for signing in. Thanks{" "}
        </h6>

        <form onSubmit={handleSignIn}>
          <div className="input-container">
            <input
              type="email"
              className="form-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            <input
              type="password"
              className="form-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="signin-btn">
            Sign In
          </button>
          <div className="divider-container">
            <span>Or</span>
          </div>
          <div className="social-login">
            <button onClick={handleSignInGoogle} className="google signin-btn">
              <i className="fab fa-google" aria-hidden="true"></i> Sign in with
              Google
            </button>
            <button
              onClick={handleSignInFacebook}
              className="facebook signin-btn"
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i> Sign in
              with Facebook
            </button>
          </div>
        </form>
        <div className="tail">
          <h6>Don't you have an account?</h6>
          <button className="loginBtn-small">Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
