import { blobColor, blobType, groupSide } from "../constants/index.js";
import { blob, clueAll, clueColor, clueSide, clueSpecific } from "../blob/utils.js";
import { Level } from "../types/blobTypes.js";

export function level_0(): Level {
  const minimumLiers = 1;
  const maximumLiers = 3
  const liersAmount = 3;

  // Left Side
  // Fer: All Oranges tell the truth
  // Padre: Only 1 on the right tells the truth
  // Jonas: Mario lies

  const fer = blob("Fer", blobColor.ORANGE,
    clueColor({ type: "all" }, blobColor.ORANGE, blobType.TRUTH),
    groupSide.LEFT);

  const padre = blob("Padre", blobColor.ORANGE,
    clueSide({ type: "quantity", amount: 1 }, groupSide.RIGHT, blobType.TRUTH),
    groupSide.LEFT);

  const jonas = blob("Jonas", blobColor.RED,
    clueSpecific("Mario", blobType.LIE),
    groupSide.LEFT);


  // Right Side
  // Sipher: There are only 2 liers
  // Mario: There are only 3 liers
  // Bidu: At least 1 red Lies

  const sipher = blob("Sipher", blobColor.RED,
    clueAll(2, blobType.LIE),
    groupSide.RIGHT);

  const mario = blob("Mario", blobColor.GREEN,
    clueAll(3, blobType.LIE),
    groupSide.RIGHT);

  const bidu = blob("Bidu", blobColor.BLUE,
    clueColor({ type: "some" }, blobColor.RED, blobType.LIE),
    groupSide.RIGHT);

  // Bottom Side
  // Dama: All bottoms tell the truth
  // Poopy: All oranges tell the truth

  const dama = blob("Dama", blobColor.GREEN,
    clueSide({ type: "all" }, groupSide.BOTTOM, blobType.TRUTH),
    groupSide.BOTTOM);

  const poopy = blob("Poopy", blobColor.ORANGE,
    clueColor({ type: "all" }, blobColor.ORANGE, blobType.TRUTH),
    groupSide.BOTTOM);

  const blobs = [fer, padre, jonas, sipher, mario, bidu, dama, poopy];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    liersAmount,
    blobs,
  };

}
