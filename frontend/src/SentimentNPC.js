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
    let color;

    if (sentiment < 1.0) {
      // More negative sentiment
      const intensity = 1.0 - sentiment; // Normalize intensity from 0 to 1 as sentiment goes from 1.0 to 0
      const red = Math.round(255 - 128 * intensity); // Start from full red and decrease based on intensity
      const green = Math.round(255 * intensity); // Green needs to increase to mix with red for yellow
      const blue = Math.round(128 * (1 - intensity)); // Blue should decrease to go from purple to yellow
      color = `rgba(${red}, ${green}, ${blue}, 0.75)`; // Mix of red and green for yellow, fade blue out
    } else if (sentiment > 1.0) {
      // More positive sentiment
      const intensity = sentiment - 1.0; // Normalize intensity from 0 to 1 as sentiment goes from 1.0 to 2.0
      const red = 255; // Keep red at full
      const green = Math.round(128 + (255 - 128) * intensity); // Increase green for lighter pink
      const blue = Math.round(255 * intensity); // Increase blue for pink
      color = `rgba(${red}, ${green}, ${blue}, 0.75)`; // End with a pink color
    } else {
      // Neutral sentiment
      color = "rgba(128, 128, 128, 0.7)"; // Grey for neutral
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
