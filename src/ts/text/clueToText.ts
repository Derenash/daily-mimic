import { blobColor } from "../constants/index.js";
import { Blob, Clue, ClueTarget, BlobColor } from "../types/index.js";

function getIsPlural(clue: Clue): boolean {
  if (clue.clueType === "color" || clue.clueType === "side") {
    return clue.target.type === "all" || clue.target.type === "range";
  } else if (clue.clueType === "specific") {
    return false;
  } else if (clue.clueType === "all") {
    return true;
  }
  return false
}

function getAmountText(amount: ClueTarget): string {
  if (amount.type === "all") {
    return "Todos";
  }
  if (amount.type === "some") {
    return "Algum";
  }
  if (amount.type === "quantity") {
    return "apenas " + amount.amount.toString();
  }
  if (amount.type === "range") {
    return `entre ${amount.minimum} a ${amount.maximum}`;
  }
  return "";
}

function getColorText(color: BlobColor, isPlural: boolean): string {
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

function getBooleanText(booleanType: string, isPlural: boolean): string {
  if (booleanType === "truth") {
    return isPlural ? "Leais" : "Leal";
  }
  if (booleanType === "lie") {
    return isPlural ? "Falsos" : "Falso";
  }
  return "";
}

function getSidePrefix(side: string | undefined, blob: Blob): string {
  if (blob.side === undefined) {
    return "";
  }
  if (blob.side === side) {
    return "Aqui";
  } else {
    return "Lá";
  }
}

function getSideText(side: string): string {
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

function getVerbText(isPlural: boolean): string {
  return isPlural ? "são" : "é";
}

export function getBlobText(blob: Blob): string {
  const color = blob.color;
  const side = blob.side;
  const booleanType = blob.clue.blobType;
  const clue = blob.clue;
  const isPlural = getIsPlural(clue);

  if (clue.clueType === "color") {
    const verbText = getVerbText(isPlural);
    const amountText = getAmountText(clue.target);
    const colorText = getColorText(color, isPlural);
    const booleanText = getBooleanText(booleanType, isPlural);

    const innerHtml = `
        <line>${amountText}</line>
        <line>${colorText}</line>
        <line>${verbText} <${booleanType}>${booleanText}</${booleanType}>
      `
    return innerHtml;
  }

  if (clue.clueType === "side") {
    const prefix = getSidePrefix(clue.side, blob);
    const sideText = getSideText(clue.side);
    const amountText = getAmountText(clue.target);
    const verbText = getVerbText(isPlural);
    const booleanText = getBooleanText(booleanType, isPlural);

    const innerHtml =
      `<line>${prefix} ${sideText}</line>
        <line>${amountText}</line>
        <line>${verbText} <${booleanType}>${booleanText}</${booleanType}>
        `
    return innerHtml;

  }

  if (clue.clueType === "specific") {
    const verbText = getVerbText(isPlural);
    const booleanText = getBooleanText(booleanType, isPlural);

    const innerHtml =
      `<line>${clue.blobName}</line>
      <line>${verbText} <${booleanType}>${booleanText}</${booleanType}>
      `

    return innerHtml;
  }

  if (clue.clueType === "all") {
    const prefix = getAllPrefix(isPlural);
    const booleanText = getBooleanText(booleanType, isPlural);

    const innerHtml =
      `<line>${prefix}</line>
      <line>apenas</line>
      <line>${clue.amount} <${booleanType}>${booleanText}</${booleanType}></line>
      `

    return innerHtml;
  }

  return "";
}

export function getAllPrefix(isPlural: boolean): string {
  return isPlural ? "Existem" : "Existe";
}

// ############################
//          ColorClue
// Todos            são      
// Algum            é        
// 1 a 3                       
//        Laranjas             
//        Vermelhos
//        Azuis
//        Verdes
//                      Falsos
//                      Leais

// ############################
//          SideClue
// Lá   
// Aqui 
//      abaixo      
//      acima       
//      na esquerda 
//      na direita 
//                  Todos são
//                  Algum é
//                  1 a 3 
//                            Falsos
//                            Leais

// ############################
//         SpecificClue
// Pedro é 
//         Falso
//         Leal

// ############################
//           AllClue
// Existem 1 a 3 Falsos
// ############################