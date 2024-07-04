import { Blob } from "../types";
import { getAmountText, getBooleanText, getColorText, getIsPlural, getSidePrefix, getSideText, getVerbText } from "./utils.js";

export function getBlobText(blob: Blob): string {
  const color = blob.color;
  const side = blob.side;
  const booleanType = blob.clue.blobType;
  const clue = blob.clue;
  const isPlural = getIsPlural(clue);

  if (clue.clueType === "color") {
    const verbText = getVerbText(isPlural);
    const amountText = getAmountText(clue.target);
    const colorText = getColorText(clue.color, isPlural);
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