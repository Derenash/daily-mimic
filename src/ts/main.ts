import { level_0 } from './levels/level_0.js';
import { applyAllInitialStyles } from './utils/applyStyles.js';
import { createMainElement } from './web/creteMainElements.js';
import { addToGroup } from './web/addToGroup.js';

const level = level_0();

document.addEventListener('DOMContentLoaded', () => {
  // apply all styles
  applyAllInitialStyles();
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
  // main.appendChild(topRow);
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
    addToGroup(target, blob);
  })

  // createMultipleCharacters(main, 9, blobNamesPTBR);
});
