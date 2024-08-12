import { levelsMap } from './levels/levelsMap.js';
import { createCharAndChatContainer, createInitialBlobCheckStates } from './web/index.js';
import { LevelSolver } from './solutions/findLevelSolutions.js';
import { setupMessageHighlighting } from './utils/messageHighlighting.js';
import { blobMapFromList, getCount } from './utils/generalUtils.js';
import { Blob, BlobType, Level } from './types/blobTypes.js';
import { generateRandomLevel } from './levels/generateLevel.js';
import Hypothesis from './solutions/hypothesis.js';
import { difficultyConfigs, DifficultyLevel } from './types/difficulty.js';
import { blobType } from './constants/enums.js';

// Types and interfaces
interface LevelCriteria {
  exactSolutions?: number;
  liarCount?: number;
}

// Level management functions
function loadLevel(level: Level) {
  clearContent();
  createInitialBlobCheckStates(level.blobs);
  const blobsMap = blobMapFromList(level.blobs);
  setupLevel(level, blobsMap);
  showSolutionInConsole(level);
}

function clearContent() {
  ['top', 'left', 'right', 'bottom'].forEach(side => {
    const area = document.querySelector(`.group.${side}`) as HTMLElement;
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

function showSolutionInConsole(level: Level) {
  const levelSolver = new LevelSolver(level);
  const solutions = levelSolver.findSolutions();

  console.clear();
  // Find fake blobs and truthful blobs
  const allBlobs = new Set<string>();
  const everFakeBlobs = new Set<string>();

  solutions.forEach(solution => {
    solution.blobsClassifications.forEach((blobClassification: BlobType, name: string) => {
      allBlobs.add(name);
      if (blobClassification === blobType.LIE) {
        everFakeBlobs.add(name);
      }
    });
  });

  const truthfulBlobs = Array.from(allBlobs).filter(blob => !everFakeBlobs.has(blob));

  // Print solutions with better formatting
  console.log(`\n%c🧩 ${level.name} Solutions`, 'color: #4CAF50; font-weight: bold; font-size: 16px;');
  console.log(`%cFound ${solutions.length} solution(s)`, 'color: #2196F3; font-weight: bold;');

  solutions.forEach((solution, index) => {
    const fakeBlobs = Array.from(solution.blobsClassifications.entries())
      .filter(([_, type]) => type === blobType.LIE)
      .map(([name, _]) => name);

    console.log(`%cSolution ${index + 1}:`, 'color: #FF9800; font-weight: bold;');
    console.log(`  %c${fakeBlobs.join(', ') || 'None'}`, 'color: #F44336; font-weight: bold;');
  });

  // Print truthful blobs
  console.log('\n%cSafe Blobs', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
  if (truthfulBlobs.length > 0) {
    console.log(`  %c${truthfulBlobs.join(', ')}`, 'color: #2196F3; font-weight: bold;');
  } else {
    console.log("%cNo blobs are always truthful across all solutions.", 'color: #F44336;');
  }

  // show level.seed 
  console.log(`\n%cSeed: ${level.seed}`, 'color: #4CAF50; font-weight: bold; font-size: 16px;');

}



function isLevelValid(level: Level, solutions: Hypothesis[], criteria: LevelCriteria): boolean {
  if (criteria.exactSolutions !== undefined && solutions.length !== criteria.exactSolutions) {
    return false;
  }
  if (criteria.liarCount !== undefined && solutions[0].currentLiarCount !== criteria.liarCount) {
    return false;
  }
  return true;
}

function loadLevelFromSeed(difficulty: DifficultyLevel, seed: string) {
  const level = generateRandomLevel(difficulty, seed);
  loadLevel(level);
}

function loadRandomLevel(difficulty: DifficultyLevel, criteria: LevelCriteria = { exactSolutions: 1 }) {
  let attempts = 0;
  let totalPathsTested = 0;
  // const { min: minLiars, max: maxLiars } = difficultyConfigs[difficulty].liarCount
  // criteria.liarCount = Math.floor(Math.random() * (maxLiars - minLiars + 1)) + minLiars;

  while (true) {
    attempts++;
    const level = generateRandomLevel(difficulty);
    const solver = new LevelSolver(level);
    const solutions = solver.findSolutions();
    const pathsTested = getCount('paths');
    totalPathsTested += pathsTested;

    console.log(`Attempting to create ${difficulty} level`);

    if (isLevelValid(level, solutions, criteria)) {
      console.log(`Valid level found: ${attempts} attempts, ${totalPathsTested} total paths tested`);
      loadLevel(level);
      console.log(`Level loaded with difficulty ${difficulty}`);
      break;
    }
  }
}

// Navigation and UI functions
function handleNavigation() {
  const hash = window.location.hash.slice(1);
  const [path, difficulty, params] = hash.split('?');

  switch (path) {
    case '/tutorial':
      loadLevelFromSeed(DifficultyLevel.Hard, "uf60uwx7pvg");
      break;
    case '/easy':
      loadRandomLevel(DifficultyLevel.Easy);
      break;
    case '/medium':
      loadRandomLevel(DifficultyLevel.Medium);
      break;
    case '/hard':
      loadRandomLevel(DifficultyLevel.Hard);
      break;
    case '/seed':
      if (params && difficulty) {
        if (difficulty.toLowerCase() === 'easy') {
          loadLevelFromSeed(DifficultyLevel.Easy, params);
        } else if (difficulty.toLowerCase() === 'medium') {
          loadLevelFromSeed(DifficultyLevel.Medium, params);
        } else if (difficulty.toLowerCase() === 'hard') {
          loadLevelFromSeed(DifficultyLevel.Hard, params);
        } else {
          console.error("Invalid difficulty level");
        }
      } else {
        console.error("No seed provided");
      }
      break;
    default:
      loadLevel(levelsMap.get('tutorial1')!);
  }
}



function toggleMode() {
  document.documentElement.classList.toggle('dark-mode');
  document.documentElement.classList.toggle('light-mode');
  document.querySelectorAll('.mode-toggle').forEach(x => x.classList.toggle('dark-mode'));
}

function setupEventListeners() {
  // Mode toggle
  document.querySelectorAll('.mode-toggle').forEach(x => x.addEventListener('click', toggleMode));

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger-icon');
  const menuItems = document.querySelector('.hamburger-items');
  if (hamburger && menuItems) {
    hamburger.addEventListener('click', () => menuItems.classList.toggle('show'));
    menuItems.addEventListener('click', () => menuItems.classList.remove('show'));
  }

  // Hash change
  window.addEventListener('hashchange', handleNavigation);

  // Random level links
  document.querySelectorAll('a[href^="#/"]').forEach((link) =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = (e.currentTarget as HTMLAnchorElement).getAttribute('href') || '';
      handleNavigation();
    })
  );
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  handleNavigation();
});
