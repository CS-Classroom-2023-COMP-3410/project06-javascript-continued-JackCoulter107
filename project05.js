const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const brushSizeInput = document.getElementById('brush-size');
const brushColorInput = document.getElementById('brush-color');
const bgColorInput = document.getElementById('bg-color');
const toggleEraserButton = document.getElementById('toggle-eraser');
const undoButton = document.getElementById('undo');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('save');

let isDrawing = false;
let hasMoved = false;
let isEraser = false; // ✅ Tracks if the eraser is active
let brushSize = parseInt(brushSizeInput.value, 10);
let brushColor = brushColorInput.value;
let backgroundColor = bgColorInput.value;
let history = [];
let lastX = 0, lastY = 0;
let points = [];

// ✅ Set initial canvas background
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);
saveHistory();

// ✅ Toggle between Brush and Eraser Mode
toggleEraserButton.addEventListener('click', () => {
  isEraser = !isEraser;
  toggleEraserButton.textContent = isEraser ? "Eraser: ON" : "Eraser: OFF";
});

// ✅ Start drawing (or erasing)
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  hasMoved = false;
  lastX = e.offsetX;
  lastY = e.offsetY;
  points = [{ x: lastX, y: lastY }];
});

// ✅ Draw smooth curves OR place a dot if no movement occurs
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  hasMoved = true;

  let newPoint = { x: e.offsetX, y: e.offsetY };
  points.push(newPoint);

  if (points.length > 2) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      let midPoint = {
        x: (points[i].x + points[i + 1].x) / 2,
        y: (points[i].y + points[i + 1].y) / 2
      };

      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';

      if (isEraser) {
        ctx.globalCompositeOperation = "destination-out"; // ✅ Erase mode
        ctx.strokeStyle = "rgba(0,0,0,1)"; // Eraser color (ignored in erase mode)
      } else {
        ctx.globalCompositeOperation = "source-over"; // ✅ Draw normally
        ctx.strokeStyle = brushColor;
      }

      ctx.quadraticCurveTo(points[i].x, points[i].y, midPoint.x, midPoint.y);
      ctx.stroke();
    }
  }
});

// ✅ On mouse up, check if a dot should be drawn
canvas.addEventListener('mouseup', () => {
  if (!hasMoved) {
    ctx.beginPath();
    ctx.arc(lastX, lastY, brushSize / 2, 0, Math.PI * 2);

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out"; // ✅ Erase dot
    } else {
      ctx.globalCompositeOperation = "source-over"; // ✅ Normal dot
      ctx.fillStyle = brushColor;
    }

    ctx.fill();
    ctx.closePath();
  }

  if (isDrawing) {
    isDrawing = false;
    ctx.globalCompositeOperation = "source-over"; // ✅ Reset mode
    saveHistory();
  }
});

// ✅ Save history for undo
function saveHistory() {
  if (history.length >= 50) {
    history.shift();
  }
  history.push(canvas.toDataURL());
}

// ✅ Undo last stroke
undoButton.addEventListener('click', () => {
  if (history.length > 1) {
    history.pop();
    const lastState = history[history.length - 1];
    const img = new Image();
    img.src = lastState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});

// ✅ Clear canvas while keeping background
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  history = [];
  saveHistory();
});

// ✅ Save canvas as image
saveButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

// ✅ Update brush size
brushSizeInput.addEventListener('input', (e) => {
  brushSize = parseInt(e.target.value, 10);
});

// ✅ Update brush color
brushColorInput.addEventListener('input', (e) => {
  brushColor = e.target.value;
});

// ✅ Update background color
bgColorInput.addEventListener('input', (e) => {
  backgroundColor = e.target.value;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveHistory();
});