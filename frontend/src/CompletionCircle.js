// CompletionCircle.js
import React from "react";

const CompletionCircle = ({ completionRate }) => {
  const radius = 36; // Radius of the circle
  const stroke = 4; // Stroke width
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (completionRate / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#4db8ff"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        fill="#000"
        dy=".3em"
        textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {completionRate.toFixed(2)}%
      </text>
    </svg>
  );
};

export default CompletionCircle;
