import { setDelayToCharacters } from "../utils";

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

function addClickEventListener(characters: NodeListOf<HTMLImageElement>): void {
  characters.forEach(character => {
    character.addEventListener('click', () => {
      console.log("click");
    });
  });
}
