import { levelsMap } from './levels/levelsMap.js';
import { createCharAndChatContainer, createInitialBlobCheckStates } from './web/index.js';
import { LevelSolver } from './solutions/findLevelSolutions.js';
import { setupMessageHighlighting } from './utils/messageHighlighting.js';
import { addToLocalCount, blobMapFromList, getCount, resetCount } from './utils/generalUtils.js';
import { Blob, Level } from './types/blobTypes.js';
import { generateRandomLevel } from './levels/generateLevel.js';

let currentLevel: Level | undefined;

function loadLevel(currentLevel: Level | null) {
  if (currentLevel) {
    // Clear existing content
    clearContent();

    // Set up the new level
    createInitialBlobCheckStates(currentLevel.blobs);
    const blobsMap = blobMapFromList(currentLevel.blobs);
    setupLevel(currentLevel, blobsMap);

    // Solve the level (if needed)
    const levelSolver = new LevelSolver(currentLevel);
    const solutions = levelSolver.findSolutions();
    const count = getCount("paths");
    console.log("Paths Taken: " + count);

    solutions.forEach(solution => {
      console.log(JSON.stringify([...solution.blobsClassifications]));
      console.log(solution.currentLiarCount);
    });
  }
}

function clearContent() {
  const contentAreas = ['top', 'left', 'right', 'bottom'].map(side =>
    document.querySelector(`.group.${side}`) as HTMLElement
  );
  contentAreas.forEach(area => {
    if (area) area.innerHTML = '';
  });
}

function setupLevel(level: Level, blobsMap: Map<string, Blob>) {
  level.blobs.forEach(blob => {
    const target = document.querySelector(`.group.${blob.side}`) as HTMLElement;
    if (target) {
      const charAndChatContainer = createCharAndChatContainer(blob);
      if (charAndChatContainer) target.appendChild(charAndChatContainer);
    }
  });
  setupMessageHighlighting(blobsMap);
}

interface LevelCriteria {
  exactSolutions: number;
}

function loadRandomLevel(blobs: 1 | 2 | 3, maxAttempts: number = 30, criteria: LevelCriteria = { exactSolutions: 1 }) {
  let bestLevel: Level | null = null;
  let bestPathsTested = 0;
  let totalAttempts = 0;
  let totalPathsTested = 0;

  function runAttempts() {
    for (let i = 0; i < maxAttempts; i++) {
      totalAttempts++;
      const level = generateRandomLevel(blobs, 3);
      const solver = new LevelSolver(level);
      const solutions = solver.findSolutions();
      const pathsTested = getCount('paths');
      totalPathsTested += pathsTested;

      console.log(`Attempt ${totalAttempts}: ${solutions.length} solution(s), ${pathsTested} paths`);

      if (solutions.length === criteria.exactSolutions && pathsTested > bestPathsTested) {
        bestLevel = level;
        bestPathsTested = pathsTested;
      }
    }
  }

  while (!bestLevel) {
    runAttempts();
  }

  console.log(`Valid level found: ${totalAttempts} attempts, ${totalPathsTested} total paths tested`);
  console.log(`Best level has ${bestPathsTested} paths tested`);
  loadLevel(bestLevel);
  console.log(`Level loaded with ${blobs} blob(s)`);
}





function handleNavigation() {
  const hash = window.location.hash.slice(1);  // Remove the '#' character
  const loadNewLevel = (x: string | Level) => {
    if (typeof (x) == "string") {
      const level = levelsMap.get(x)
      if (level) {
        loadLevel(level)
      }
    } else {
      loadLevel(x)
    }
  }
  switch (hash) {
    case '/tutorial':
      loadNewLevel('tutorial1');  // or whichever tutorial level you want
      break;
    case '/easy':
      loadNewLevel('level1');  // or whichever easy level you want
      break;
    case '/medium':
      loadNewLevel('level2');  // or whichever medium level you want
      break;
    case '/hard':
      loadNewLevel('level3');  // or whichever hard level you want
      break;
    case '/random':
      loadRandomLevel(3);
      break;
    default:
      loadNewLevel('tutorial1');  // Default to tutorial
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modeToggles = document.querySelectorAll('.mode-toggle') as NodeListOf<HTMLElement>;

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

    menuItems.addEventListener('click', function () {
      menuItems.classList.remove('show');
    });
  }

  // Add event listener for hash changes
  window.addEventListener('hashchange', handleNavigation);

  // Add click event listener to the random level link
  const randomLinks = document.querySelectorAll('a[href="#/random"]');
  randomLinks.forEach((randomLink) =>
    randomLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '/random';
      loadRandomLevel(3);
    })
  )

  // Initial navigation
  handleNavigation();
});