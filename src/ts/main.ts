import { level1, level2, tutorial1, tutorial2 } from './levels/index.js';
import { createCharAndChatContainer, createInitialBlobCheckStates } from './web/index.js';
import { LevelSolver } from './solutions/findLevelSolutions.js';
import { setupMessageHighlighting } from './utils/messageHighlighting.js';
import { blobMapFromList, getCount, resetCount } from './utils/generalUtils.js';

const level = tutorial1();
// const level = tutorial2();
// const level = level_0();
// const level = level_2();
resetCount()
localStorage.setItem("debug", "false");
// localStorage.setItem("debug", "true");

// Start the timer
// const startTime = performance.now();

// Your original code
// for (let id = 0; id < 10000; id++) {
// levelSolver(level);
// }

// End the timer
// const endTime = performance.now();

// Calculate the execution time
// const executionTime = endTime - startTime;


// Log the results
// console.log(`Execution time: ${executionTime} milliseconds`);
// console.log(`Average time per iteration: ${executionTime / 10000} milliseconds`);
// console.log("Solutions for the Level:" + level.name);
// console.log(JSON.stringify([...solutions], null, 2));
// solutions.forEach(solution => {
//   console.log(JSON.stringify([...solution.blobs]));
// })

const levelSolver = new LevelSolver(level);
const solutions = levelSolver.findSolutions();
const count = getCount()
console.log("Paths Taken: " + count);

solutions.forEach(solution => {
  console.log(JSON.stringify([...solution.blobsClassifications]));
  console.log(solution.currentLiarCount);
})

createInitialBlobCheckStates(level.blobs);

const blobsMap = blobMapFromList(level.blobs);

document.addEventListener('DOMContentLoaded', () => {
  const modeToggles = document.querySelectorAll('.mode-toggle') as NodeListOf<HTMLElement>;
  const topRow = document.querySelector('.group.top') as HTMLElement;
  const leftColumn = document.querySelector('.middle-row .group.left') as HTMLElement;
  const rightColumn = document.querySelector('.middle-row .group.right') as HTMLElement;
  const bottomRow = document.querySelector('.group.bottom') as HTMLElement;

  // Function to toggle between light and dark mode
  function toggleMode() {
    document.documentElement.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('light-mode');
    modeToggles.forEach(x => x.classList.toggle('dark-mode'));
  }

  // Add click event listener to the mode toggle button
  modeToggles.forEach(x => x.addEventListener('click', toggleMode));

  const hamburger = document.querySelector('.hamburger-icon');
  const menuItems = document.querySelector('.hamburger-items');

  if (hamburger && menuItems) {
    hamburger.addEventListener('click', function () {
      menuItems.classList.toggle('show');
    });
  }

  const blobs = level.blobs;

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
  });

  setupMessageHighlighting(blobsMap);
});

