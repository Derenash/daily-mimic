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
    const count = getCount("pathes");
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

function loadRandomLevel() {
  const possibleValues: (1 | 2 | 3)[] = [1, 2, 3];
  const randomAmountOfBlobs = possibleValues[Math.floor(Math.random() * possibleValues.length)];
  let randomLevel: Level;
  let attemptsToFindALevel = 0;
  let totalPathesTested = 0;

  while (true) {
    const level = generateRandomLevel(randomAmountOfBlobs, 3);
    const solutions = new LevelSolver(level).findSolutions();
    attemptsToFindALevel++;
    totalPathesTested += getCount('pathes');

    if (solutions.length === 1) {
      randomLevel = level;
      console.log(`Valid level found: ${attemptsToFindALevel} attempts, ${totalPathesTested} total paths tested`);
      break;
    } else {
      console.log(`Attempt ${attemptsToFindALevel}: ${solutions.length} solution(s), ${getCount('pathes')} paths`);
    }
  }

  loadLevel(randomLevel);
  console.log(`Level loaded with ${randomAmountOfBlobs} blob(s)`);
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
      loadRandomLevel();
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
  }

  // Add event listener for hash changes
  window.addEventListener('hashchange', handleNavigation);

  // Add click event listener to the random level link
  const randomLink = document.querySelector('a[href="#/random"]');
  if (randomLink) {
    randomLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '/random';
      loadRandomLevel();
    });
  }

  // Initial navigation
  handleNavigation();
});