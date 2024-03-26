import React, { useEffect, useRef } from "react";
import "./BubbleEffect.css";

const BubbleEffect = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const hue = 210; // 预设的颜色值
    const litCount = 50; // 预设生成的气泡数量

    const clip = (v, min, max = Infinity) => {
      if (v < min) return min;
      else if (v > max) return max;
      else return v;
    };

    const randRange = (min, max) => Math.random() * (max - min) + min;

    const bubble = (x, y, rect, hue, target) => {
      const size = randRange(10, rect.width / 20);
      const circleHue = hue + randRange(-20, 20);
      const animDuration = randRange(clip(size ** 2 / 1000, 1), 6);
      const zIndex = Math.random() < 0.1 ? 2 : -1;
      const circle = document.createElement("span");
      circle.className = "lit";
      circle.style.left = x + "px";
      circle.style.top = y + "px";
      circle.style.width = size + "px";
      circle.style.height = size + "px";
      circle.style.background = `hsl(${circleHue}deg, 100%, 60%)`;
      circle.style.zIndex = zIndex;
      circle.style.animationDuration = `${animDuration}s`;
      target.appendChild(circle);
    };

    const rect = container.getBoundingClientRect();
    for (let i = 0; i < litCount; i++) {
      const x = randRange(0, rect.width);
      const y = randRange(0, rect.height);
      bubble(x, y, rect, hue, container);
    }

    // 由于气泡是一次性生成的，不需要进行清理
  }, []);

  return <div className="lit-container" ref={containerRef}></div>;
};

export default BubbleEffect;
