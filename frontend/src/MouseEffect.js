import "./MouseEffect.css"; // Ensure CSS is loaded for these effects

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

function MouseEffect() {
  document.addEventListener(
    "mousemove",
    throttle(function (e) {
      let body = document.querySelector("body");
      let circle = document.createElement("span");
      circle.className = "mouse-effect-span"; // 添加类名

      let x = e.offsetX;
      let y = e.offsetY;
      circle.style.left = x + "px";
      circle.style.top = y + "px";
      let size = Math.random() * 60;
      circle.style.width = 10 + size + "px";
      circle.style.height = 10 + size + "px";
      body.appendChild(circle);
      setTimeout(function () {
        circle.remove();
      }, 1800);
    }, 50)
  );
}

export default MouseEffect;
