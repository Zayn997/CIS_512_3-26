import React, { useRef, useEffect } from "react";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const mouse = {
    x: undefined,
    y: undefined,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Circle {
      constructor(x, y, radius, vx, vy, rgb, opacity, birth, life) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.rgb = rgb; // Save rgb as a property
        this.opacity = opacity;
        this.birth = birth;
        this.life = life;
      }

      draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        c.fillStyle = `rgba(${this.rgb},${this.opacity})`; // Use this.rgb here
        c.fill();
      }

      update() {
        if (
          this.x + this.radius > window.innerWidth ||
          this.x - this.radius < 0
        ) {
          this.vx = -this.vx;
        }

        if (
          this.y + this.radius > window.innerHeight ||
          this.y - this.radius < 0
        ) {
          this.vy = -this.vy;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.opacity = 1 - ((frame - this.birth) * 1) / this.life;

        if (frame > this.birth + this.life) {
          for (let i = 0; i < circleArray.length; i++) {
            if (
              this.birth === circleArray[i].birth &&
              this.life === circleArray[i].life
            ) {
              circleArray.splice(i, 1);
              break;
            }
          }
        } else {
          this.draw();
        }
      }
    }

    let circleArray = [];

    const colorArray = ["224, 195, 252", "142, 197, 252", "224, 195, 222"];

    const drawCircles = () => {
      for (let i = 0; i < 6; i++) {
        let radius = Math.floor(Math.random() * 4) + 2;
        let vx = Math.random() * 2 - 1;
        let vy = Math.random() * 2 - 1;
        let spawnFrame = frame;
        let rgb = colorArray[Math.floor(Math.random() * colorArray.length)];
        let life = 100;
        circleArray.push(
          new Circle(mouse.x, mouse.y, radius, vx, vy, rgb, 1, spawnFrame, life)
        );
      }
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      drawCircles();
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize or adjust the canvas and particles as needed
      // initCanvas();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 1;
      c.clearRect(0, 0, canvas.width, canvas.height);
      circleArray.forEach((circle) => circle.update());
    };

    animate();

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default CanvasComponent;
