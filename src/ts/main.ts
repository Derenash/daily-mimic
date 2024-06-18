document.addEventListener('DOMContentLoaded', () => {
  const color = getRandomColor();
  const main = document.querySelector('main');
  if (!main) {
    console.error("No main found");
    return;
  }
  createMultipleCharacters(main, 10, 1280, 720);
  const characters = document.querySelectorAll<HTMLImageElement>('.character-container');

  addJumpEventListener(characters);
  addClickEventListener(characters);
});

function createMultipleCharacters(parent: HTMLElement, amount: number, maximumX: number, maximumY: number): void {
  for (let i = 0; i < amount; i++) {
    const position = {
      x: Math.floor(Math.random() * maximumX),
      y: Math.floor(Math.random() * maximumY)
    };
    const color = getRandomColor();
    const character = createCharacter(color, position);
    parent.appendChild(character);
  }
}

function createCharacter(color: string, position: { x: number, y: number }): HTMLDivElement {
  const characterContainerContainer = document.createElement('div');
  characterContainerContainer.classList.add('character-container-container');
  characterContainerContainer.style.left = `${position.x}px`;
  characterContainerContainer.style.top = `${position.y}px`;

  const characterContainer = document.createElement('div');
  characterContainer.classList.add('character-container');

  let path = "assets/img/"

  if (position.x % 2 == 0) {
    path = "assets/imgFlip/"
  }

  const body = createCharacterElement('body', `${path}body.svg`);
  const hat = createCharacterElement('hat', `${path}hat-${color}.svg`);

  body.classList.add('idle');
  hat.classList.add('idle');

  setDelayToCharacters([body, hat], 1000);


  characterContainer.appendChild(body);
  characterContainer.appendChild(hat);
  characterContainerContainer.appendChild(characterContainer);

  return characterContainerContainer;
}

function getRandomColor(): string {
  const colors = ['blue', 'green', 'red', 'orange'];
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function createCharacterElement(className: string, src: string): HTMLImageElement {
  const element = document.createElement('img');
  element.classList.add('character', className);
  element.src = src;
  element.alt = "Character";
  return element;
}

function addJumpEventListener(charactersContainers: NodeListOf<HTMLImageElement>): void {
  if (charactersContainers.length > 0) {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        charactersContainers.forEach(characterContainer => {
          const characters = characterContainer.querySelectorAll<HTMLImageElement>('.character');
          const delay = setDelayToCharacters(characters, 1000);
          characters.forEach(character => {
            character.classList.remove('idle');
            character.classList.add('jump');
            setTimeout(() => {
              character.classList.remove('jump');
              character.classList.add('idle');
            }, 3000 + delay);
          });
        });
      }
    });
  } else {
    console.error("No characters found");
  }
}

// Sets a random delay to all characters
// Same delay for all characters
function setDelayToCharacters(characters: HTMLImageElement[] | NodeListOf<HTMLImageElement>, max: number, fixed?: number): number {
  const delay = Math.floor(Math.random() * max);
  characters.forEach(character => {
    character.style.animationDelay = `${delay}ms`;
  });
  return delay;
}

function addClickEventListener(characters: NodeListOf<HTMLImageElement>): void {
  characters.forEach(character => {
    character.addEventListener('click', () => {
      console.log("click");
    });
  });
}
