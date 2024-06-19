import { blobNamesPTBR } from './constants/index.js';
import { createMainElement, createMultipleCharacters } from './utils/index.js';


document.addEventListener('DOMContentLoaded', () => {
  const main = createMainElement();
  // document.body.appendChild(main);

  if (!main) {
    console.error("No main found");
    return;
  }

  createMultipleCharacters(main, 9, blobNamesPTBR);
});



// const box: HTMLElement = document.querySelector('.box') as HTMLElement;
const box = document.createElement('img');
box.classList.add('box');
box.src = '../assets/img/body.svg';
box.draggable = false
document.body.appendChild(box);

let startTime: number;

// add drag mechanic to box 
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

interface LerpConfig {
  min: number;
  max: number;
  halfCycle: number;
}

function getLerp(cfg: LerpConfig, elapsed: number) {
  const progress = (elapsed / (cfg.halfCycle * 2)) % 1;
  if (progress < 0.5) {
    return cfg.min + (cfg.max - cfg.min) * (progress * 2);
  } else {
    return cfg.max - (cfg.max - cfg.min) * ((progress - 0.5) * 2);
  }
}

function updateScale(timestamp: number) {
  if (!startTime) startTime = timestamp;
  const elapsed = (timestamp - startTime);
  const scaleX = getLerp({ min: 0.9, max: 1.1, halfCycle: 120 }, elapsed);
  const scaleY = getLerp({ min: 1.1, max: 0.9, halfCycle: 120 }, elapsed);
  const rotate = getLerp({ min: -10, max: 10, halfCycle: 200 }, elapsed);
  box.style.transform = `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
  if (isDragging === false) {
    console.log("not dragging")
    return;
  }
  requestAnimationFrame(updateScale);
}

box.addEventListener('mousedown', (event) => {
  console.log('mousedown')
  isDragging = true;
  offsetX = event.offsetX;
  offsetY = event.offsetY;
  requestAnimationFrame(updateScale);
});

document.addEventListener('mouseup', () => {
  console.log('mouseup')
  isDragging = false;
});

document.addEventListener('mousemove', (event) => {
  console.log('mousemove')
  if (isDragging) {
    box.style.left = `${event.clientX - offsetX}px`;
    box.style.top = `${event.clientY - offsetY}px`;
  }
});