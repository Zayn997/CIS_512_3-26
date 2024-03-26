import React, { useEffect, useRef } from "react";
import "./Particles.css";

const Particles = () => {
  const particlesContainer = useRef();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      // 获取粒子容器的位置信息
      const { left, top } = particlesContainer.current.getBoundingClientRect();

      // 计算鼠标相对于粒子容器的位置
      const x = clientX - left;
      const y = clientY - top;

      // 获取所有粒子
      const particles =
        particlesContainer.current.getElementsByClassName("particle");

      // 遍历粒子并更新其样式
      for (let particle of particles) {
        const deltaX = particle.offsetLeft + particle.offsetWidth / 2 - x;
        const deltaY = particle.offsetTop + particle.offsetHeight / 2 - y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const scale = Math.max(0.4, 1 - distance / 300); // 根据距离调整大小
        particle.style.transform = `scale(${scale})`;
      }
    };

    // 添加鼠标移动事件监听器
    window.addEventListener("mousemove", handleMouseMove);

    // 清除事件监听器
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 创建一个包含100个粒子的数组
  const particleArray = new Array(400).fill(null);

  return (
    <div id="particles-container" ref={particlesContainer}>
      {particleArray.map((_, index) => (
        <div key={index} className={`particle particle-${index + 1}`}></div>
      ))}
    </div>
  );
};

export default Particles;
