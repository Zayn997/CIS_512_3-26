import React, { useRef, useEffect } from "react";
import "./Particles.css";

// Utility function
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Bubbles class
class Bubbles {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = { bg: "rgba(255, 255, 255, 0.45)" };
    this.velocity = { x: (Math.random() - 0.5) * 0.5, y: Math.random() * 2 };
    this.opacity = 1;
  }
  draw(c) {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color.bg;
    c.fill();
    c.closePath();
  }
  update(c) {
    this.y -= this.velocity.y;
    this.draw(c);
  }
}

// MiniBubbles class
class miniBubbles {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = { bg: "rgba(255, 255, 255, 0.45)" };
    this.velocity = {
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 1) * 0.5,
    };
    this.gravity = -0.03;
    this.timeToLive = 500;
  }
  draw(c) {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color.bg;
    c.fill();
    c.closePath();
    c.restore();
  }
  update(c) {
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.timeToLive -= 1;
    this.draw(c);
  }
}

const Particles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let bubbles = [];
    let minibubbles = [];
    let timer = 0;
    let spawnRate = 99;

    // Setup background gradient
    const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, "#D6E9FF");
    backgroundGradient.addColorStop(1, "#D6E9FF");

    const animate = () => {
      requestAnimationFrame(animate);
      // c.fillStyle = backgroundGradient;
      // c.fillRect(0, 0, canvas.width, canvas.height);
      c.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble, index) => {
        bubble.update(c);
        if (bubble.radius === 0) {
          bubbles.splice(index, 1);
        }
      });

      minibubbles.forEach((minibubble, index) => {
        minibubble.update(c);
        if (minibubble.timeToLive === 0) {
          minibubbles.splice(index, 1);
        }
      });

      timer++;
      if (timer % spawnRate === 0) {
        const radius = randomIntFromRange(15, 30);
        const x = Math.max(radius, Math.random() * canvas.width - radius);
        const y = window.innerHeight + 100;
        bubbles.push(new Bubbles(x, y, radius));
        minibubbles.push(new miniBubbles(x, y, radius));
        spawnRate = randomIntFromRange(70, 200);
      }
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      bubbles.forEach((bubble, index) => {
        if (Math.hypot(bubble.x - mouseX, bubble.y - mouseY) < bubble.radius) {
          for (let i = 0; i < 10; i++) {
            minibubbles.push(
              new miniBubbles(bubble.x, bubble.y, Math.random() * 2 + 1)
            );
          }
          bubbles.splice(index, 1);
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // backgroundGradient.addColorStop(0, "#ffde00");
      // backgroundGradient.addColorStop(1, "#ff77a9");
      backgroundGradient.addColorStop(0, "#D6E9FF"); // Yellow
      backgroundGradient.addColorStop(1, "#D6E9FF"); // Pink
    });

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0 }} />
  );
};

export default Particles;
