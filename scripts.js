const draggableElements = document.querySelectorAll(".draggable");
const dropZone = document.getElementById("drop-zone");
const evaluationArea = document.getElementById("evaluation-area");
const shapesContainer = document.getElementById("shapes-container");

let randomShapes = [];

draggableElements.forEach((element, index) => {
  gsap.set(element, { x: index * 120, y: 0, scale: 1 });
  Draggable.create(element, {
    bounds: dropZone,
    onDragStart: onDragStart,
    onDragEnd: onDragEnd,
  });
});

function onDragStart() {
  this.startX = this.x;
  this.startY = this.y;
  gsap.to(this.target, { scale: 1.2 });
}

function isInsideDropZone(element) {
  const elementRect = element.getBoundingClientRect();
  const dropZoneRect = dropZone.getBoundingClientRect();
  const evaluationAreaRect = evaluationArea.getBoundingClientRect();

  return (
    elementRect.left >= dropZoneRect.left &&
    elementRect.right <= dropZoneRect.right &&
    elementRect.top >= dropZoneRect.top &&
    elementRect.bottom <= evaluationAreaRect.bottom
  );
}

function onDragEnd() {
  gsap.to(this.target, { scale: 1 });
  const dropZoneRect = dropZone.getBoundingClientRect();
  const evaluationAreaRect = evaluationArea.getBoundingClientRect();
  const targetRect = this.target.getBoundingClientRect();

  const isOverlapping =
    targetRect.left < dropZoneRect.right &&
    targetRect.right > dropZoneRect.left &&
    targetRect.top < dropZoneRect.bottom &&
    targetRect.bottom > dropZoneRect.top &&
    targetRect.left < evaluationAreaRect.right &&
    targetRect.right > evaluationAreaRect.left &&
    targetRect.top < evaluationAreaRect.bottom &&
    targetRect.bottom > evaluationAreaRect.top;

  if (isOverlapping) {
    const shape = this.target.id;
    evaluateShape(shape);
  } else {
    gsap.to(this.target, { x: this.startX, y: this.startY });
  }
}

function evaluateShape(shape) {
  if (evaluationArea.classList.contains(shape)) {
    gsap.to(`#${shape}`, {
      opacity: 0,
      duration: 0.5,
      onComplete: updateEvaluationArea(shape),
    });
  } else {
    gsap.to(`#${shape}`, { x: 0, y: 0, duration: 0.5 });
  }

  function updateEvaluationArea(shape) {
    const evaluatedShape = document.getElementById(shape);
    if (evaluatedShape && evaluatedShape.parentNode === dropZone) {
      dropZone.removeChild(evaluatedShape);
    }

    randomShapes.splice(randomShapes.indexOf(shape), 1);
    if (randomShapes.length === 0) {
      hideEvaluationArea();
      showRestartButton();
      return;
    }

    const newShape =
      randomShapes[Math.floor(Math.random() * randomShapes.length)];
    evaluationArea.setAttribute("class", `evaluation-area ${newShape}`);
  }

  function hideEvaluationArea() {
    evaluationArea.style.display = "none";
  }

  function showRestartButton() {
    const restartButton = document.getElementById("restart-button");
    restartButton.style.display = "flex";
  }
}

function restartProcess() {
  randomShapes = [];
  generateShapes();
  const restartButton = document.getElementById("restart-button");
  restartButton.style.display = "none";
}

function getRandomColor() {
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#000080",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function generateShapes() {
  const availableShapes = [
    "circle",
    "square",
    "rectangle",
    "pentagon",
    "hexagon",
    "octagon",
    "star",
    "diamond",
  ];

  shapesContainer.innerHTML = "";

  for (let i = 0; i < availableShapes.length; i++) {
    const randomIndex = Math.floor(Math.random() * availableShapes.length);
    const shape = availableShapes[randomIndex];
    randomShapes.push(shape);
    availableShapes.splice(randomIndex, 1);
    
    const shapeElement = document.createElement("div");
    shapeElement.classList.add("draggable", "shape", shape);
    shapeElement.style.backgroundColor = getRandomColor();
    shapeElement.id = shape;

    shapesContainer.appendChild(shapeElement);

    gsap.set(shapeElement, { x: i, y: 0, scale: 1 });
    Draggable.create(shapeElement, {
      bounds: dropZone,
      onDragStart: onDragStart,
      onDragEnd: onDragEnd,
    });
  }

  const randomShapeIndex = Math.floor(Math.random() * randomShapes.length);
  const randomShape = randomShapes[randomShapeIndex];
  evaluationArea.style.display = "flex";
  evaluationArea.setAttribute("class", `evaluation-area ${randomShape}`);

  return randomShapes;
}

generateShapes();
