const draggableElements = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('drop-zone');
const evaluationArea = document.getElementById('evaluation-area');


// Initialize draggable elements
draggableElements.forEach((element, index) => {
    gsap.set(element, { x: index * 120, y: 0, scale: 1 });
    Draggable.create(element, {
        bounds: dropZone,
        onDragStart: onDragStart,
        onDragEnd: onDragEnd
    });
});

// Callback function when drag starts
function onDragStart() {
    this.startX = this.x;
    this.startY = this.y;
    gsap.to(this.target, { scale: 1.2 });
}

// Callback function when drag ends
function onDragEnd() {
    gsap.to(this.target, { scale: 1 });
    const dropZoneRect = dropZone.getBoundingClientRect();
    const evaluationAreaRect = evaluationArea.getBoundingClientRect();
    const targetRect = this.target.getBoundingClientRect();
  
    if (
      targetRect.left < dropZoneRect.right &&
      targetRect.right > dropZoneRect.left &&
      targetRect.top < dropZoneRect.bottom &&
      targetRect.bottom > evaluationAreaRect.top
    ) {
      const shape = this.target.id;
      evaluateShape(shape);
    } else {
      gsap.to(this.target, { x: this.startX, y: this.startY });
    }
  }

// Check if element is inside the drop zone
function isInsideDropZone(element, dropZone) {
    const elementRect = element.getBoundingClientRect();
    const dropZoneRect = dropZone.getBoundingClientRect();
    return (
        elementRect.left >= dropZoneRect.left &&
        elementRect.right <= dropZoneRect.right &&
        elementRect.top >= dropZoneRect.top &&
        elementRect.bottom <= dropZoneRect.bottom
    );
}

// Script to run when shape is dropped inside the drop zone
function runScript(shape) {
    console.log(`The dropped shape is: ${shape}`);
}

function evaluateShape(shape) {
    let result;
    switch (shape) {
      case 'circle':
        result = 'Circle';
        break;
      case 'triangle':
        result = 'Triangle';
        break;
      case 'square':
        result = 'Square';
        break;
      case 'rectangle':
        result = 'Rectangle';
        break;
      default:
        result = 'Unknown Shape';
        break;
    }
    evaluationArea.textContent = `Shape: ${result}`;
  
    // Hide the shape with fade-out animation
    gsap.to(`#${shape}`, { opacity: 0, duration: 0.5, onComplete: removeShape });
  }
  
  function removeShape() {
    // Remove the shape from the DOM
    this.target.remove();
  }