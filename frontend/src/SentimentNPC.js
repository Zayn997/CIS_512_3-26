import React, { useState, useEffect } from "react";
import "./SentimentNPC.css";

function SentimentNPC({ sentiment }) {
  //the first I use false, in the future we can check
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const npcPosition = document
        .querySelector(".npc")
        .getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (npcPosition < windowHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getColorFromSentiment = (sentiment) => {
    // Sentiment is expected to be in the range of 0.10 to 2.00
    let color = "rgba(128, 128, 128, 0.7)"; // Default to grey for neutral sentiment

    if (sentiment < 0.5) {
      // More negative sentiment
      const intensity = 1 - sentiment / 0.5;
      const red = Math.round(255 * intensity);
      color = `rgba(${red}, 0, 0, 0.75)`; // More intense red for more negative sentiment
    } else if (sentiment > 1.5) {
      // More positive sentiment
      const intensity = (sentiment - 1.5) / 0.5;
      const green = Math.round(255 * intensity);
      color = `rgba(0, ${green}, 0, 0.75)`; // More intense green for more positive sentiment
    }

    return color;
  };

  const getScaleFromSentiment = (sentiment) => {
    // Assuming sentiment is a number between 0.10 and 2.00
    // Normalize sentiment to a 0-1 range for scaling
    const normalized = (sentiment - 0.1) / (2.0 - 0.1);
    // Scale the NPC between 0.5x to 1.5x its original size
    // return 0.9 + normalized;
    return 0.9 + normalized * 0.68;
  };

  const npcStyles = {
    // *first version -- transform: `scale(${getScaleFromSentiment(sentiment)})`,
    "--npc-scale": getScaleFromSentiment(sentiment),
    opacity: isVisible ? 1 : 0,
    transition:
      "opacity 0.8s ease-in-out, transform 0.8s ease-in-out, background-color 0.8s ease-in-out",
    backgroundColor: getColorFromSentiment(sentiment),
    transform: `translateX(-50%) scale(${getScaleFromSentiment(sentiment)})`, // Apply both translate and scale
    transformOrigin: "bottom center", // Ensure scaling happens upwards from the bottom
  };

  const eyeStyles = {
    transform: `translateY(${sentiment * 13}px)`,
    transition: "transform 0.8s ease-in-out",
  };

  return (
    <div className="npc" style={npcStyles}>
      <div className="npc-eye" style={eyeStyles}></div>
      <div className="npc-eye" style={eyeStyles}></div>
    </div>
  );
}

export default SentimentNPC;
