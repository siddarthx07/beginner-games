// Simple graphics API wrapper around HTML Canvas
(function (global) {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const GraphicsAPI = {
    clear(color = "#000") {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    drawRect(x, y, width, height, color = "#fff") {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    },

    drawCircle(x, y, radius, color = "#fff") {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    },

    getCanvasSize() {
      return { width: canvas.width, height: canvas.height };
    },

  };

  global.GraphicsAPI = GraphicsAPI;
})(window);
