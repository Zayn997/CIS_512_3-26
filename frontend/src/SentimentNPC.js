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

  const npcStyles = {
    transform: `scale(${1 + sentiment * 2.2})`,
    opacity: isVisible ? 1 : 0,
    transition: "opacity 1s ease-in-out",
  };

  const eyeStyles = {
    transform: `translateY(${sentiment * 15}px)`,
  };

  return (
    <div className="npc" style={npcStyles}>
      <div className="npc-eye" style={eyeStyles}></div>
      <div className="npc-eye" style={eyeStyles}></div>
    </div>
  );
}

export default SentimentNPC;
