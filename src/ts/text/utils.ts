import { blobColor } from "../constants/index.js";
import { Blob, BlobColor, Clue, ClueTarget } from "../types/index.js";

export function getIsPlural(clue: Clue): boolean {
  if (clue.clueType === "color" || clue.clueType === "side") {
    if (clue.target.type === "all") {
      return true;
    }
    if (clue.target.type === "range") {
      if (clue.target.minimum === clue.target.maximum) {
        return false
      }
      return true
    }
  } else if (clue.clueType === "specific") {
    return false;
  } else if (clue.clueType === "all") {
    return true;
  }
  return false
}

export function getAmountText(amount: ClueTarget): string {
  if (amount.type === "all") {
    return "Todos";
  }
  if (amount.type === "some") {
    return "Algum";
  }
  if (amount.type === "range") {
    if (amount.minimum === amount.maximum) {
      return "apenas " + amount.minimum.toString();
    }
    return `entre ${amount.minimum} a ${amount.maximum}`;
  }
  return "";
}

export function getColorText(color: BlobColor, isPlural: boolean): string {
  if (color === blobColor.ORANGE) {
    return isPlural ? "Laranjas" : "Laranja";
  }
  if (color === blobColor.RED) {
    return isPlural ? "Vermelhos" : "Vermelho";
  }
  if (color === blobColor.BLUE) {
    return isPlural ? "Azuis" : "Azul";
  }
  if (color === blobColor.GREEN) {
    return isPlural ? "Verdes" : "Verde";
  }
  return "";
}

export function getBooleanText(booleanType: string, isPlural: boolean): string {
  if (booleanType === "truth") {
    return isPlural ? "Leais" : "Leal";
  }
  if (booleanType === "lie") {
    return isPlural ? "Falsos" : "Falso";
  }
  return "";
}

export function getSidePrefix(side: string | undefined, blob: Blob): string {
  if (blob.side === undefined) {
    return "";
  }
  if (blob.side === side) {
    return "Aqui";
  } else {
    return "Lá";
  }
}

export function getSideText(side: string): string {
  if (side === "top") {
    return "acima";
  }
  if (side === "bottom") {
    return "abaixo";
  }
  if (side === "left") {
    return "na esquerda";
  }
  if (side === "right") {
    return "na direita";
  }
  return "";
}

export function getVerbText(isPlural: boolean): string {
  return isPlural ? "são" : "é";
}