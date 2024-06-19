export function setDelayToCharacters(characters: HTMLImageElement[] | NodeListOf<HTMLImageElement>, max: number, fixed?: number): number {
  const delay = Math.floor(Math.random() * max);
  characters.forEach(character => {
    character.style.animationDelay = `${delay}ms`;
  });
  return delay;
}