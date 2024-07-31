import { level_0, tutorial2, tutorial } from './levels/index.js';
import { createMainElement } from './web/createMainElement.js';
import { createCharAndChatContainer } from './web/createCharAndChatContainer.js';
import { levelSolver } from './types/blobTypes.js';
import { setupMessageHighlighting } from './utils/messageHighlighting.js';
import { blobMapFromList, getCount, resetCount } from './utils/generalUtils.js';

// const level = tutorial();
// const level = tutorial2();
const level = level_0();
resetCount()
localStorage.setItem("debug", "true");

// Start the timer
const startTime = performance.now();



// Your original code
// for (let id = 0; id < 10000; id++) {
// levelSolver(level);
// }

// End the timer
const endTime = performance.now();

// Calculate the execution time
const executionTime = endTime - startTime;

const solutions = levelSolver(level);
getCount()

solutions.forEach(solution => {
  console.log(JSON.stringify([...solution.blobs]));
  console.log(solution.lierCount);
})

// Log the results
console.log(`Execution time: ${executionTime} milliseconds`);
console.log(`Average time per iteration: ${executionTime / 10000} milliseconds`);
// console.log("Solutions for the Level:" + level.name);
// console.log(JSON.stringify([...solutions], null, 2));
// solutions.forEach(solution => {
//   console.log(JSON.stringify([...solution.blobs]));
// })
const blobsMap = blobMapFromList(level.blobs);

document.addEventListener('DOMContentLoaded', () => {
  // apply all styles
  const main: HTMLElement = createMainElement();
  main.className = 'game-container';
  document.body.appendChild(main);

  if (!main) {
    console.error("No main found");
    return;
  }

  const blobs = level.blobs;

  const topRow = document.createElement('div');
  topRow.className = 'group';
  topRow.classList.add('top');

  const middleRow = document.createElement('div');
  middleRow.className = 'middle-row';

  const bottomRow = document.createElement('div');
  bottomRow.className = 'group';
  bottomRow.classList.add('bottom');

  const leftColumn = document.createElement('div');
  leftColumn.className = 'group';
  leftColumn.classList.add('left');

  const rightColumn = document.createElement('div');
  rightColumn.className = 'group';
  rightColumn.classList.add('right');

  middleRow.appendChild(leftColumn);
  middleRow.appendChild(rightColumn);
  main.appendChild(topRow);
  main.appendChild(middleRow);
  main.appendChild(bottomRow);

  blobs.forEach(blob => {
    let target: HTMLElement | null = null;
    switch (blob.side) {
      case 'top':
        target = topRow;
        break;
      case 'left':
        target = leftColumn;
        break;
      case 'right':
        target = rightColumn;
        break;
      case 'bottom':
        target = bottomRow;
        break;
      default:
        console.error('Invalid side');
        return;
    }
    const charAndChatContainer = createCharAndChatContainer(blob);
    if (charAndChatContainer) target.appendChild(charAndChatContainer);
  })
  setupMessageHighlighting(blobsMap);
});
