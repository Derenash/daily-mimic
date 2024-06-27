import { blobColor, blobType, groupSide } from "../constants/index.js";
import { Level, blob, blobGroup, clueAll, clueColor, clueSide, clueSpecific } from "../types/index.js";
import { setGroupSide } from "../utils/generalUtils.js";

export function level_0(): Level {
  const minimumLiers = 1;
  const maximumLiers = 3
  const liersAmount = 3;

  // Left Side
  // Fer: All Oranges tell the truth
  // Padre: Only 1 on the right tells the truth
  // Jonas: Mario lies

  const fer = blob("Fer", blobColor.ORANGE,
    clueColor({ type: "all" }, blobColor.ORANGE, blobType.TRUTH))

  const padre = blob("Padre", blobColor.ORANGE,
    clueSide({ type: "quantity", amount: 1 }, groupSide.RIGHT, blobType.TRUTH));

  const jonas = blob("Jonas", blobColor.RED,
    clueSpecific("Mario", blobType.LIE));

  const leftSide = setGroupSide(blobGroup([fer, padre, jonas]), groupSide.LEFT);

  // Right Side
  // Sipher: There are only 2 liers
  // Mario: There are only 3 liers
  // Bidu: At least 1 red Lies

  const sipher = blob("Sipher", blobColor.RED,
    clueAll(2, blobType.LIE));

  const mario = blob("Mario", blobColor.GREEN,
    clueAll(3, blobType.LIE));

  const bidu = blob("Bidu", blobColor.BLUE,
    clueColor({ type: "some" }, blobColor.RED, blobType.LIE));

  const rightSide = setGroupSide(blobGroup([sipher, mario, bidu]), groupSide.RIGHT);

  // Bottom Side
  // Dama: All bottoms tell the truth
  // Poopy: All oranges tell the truth

  const dama = blob("Dama", blobColor.GREEN,
    clueSide({ type: "all" }, groupSide.BOTTOM, blobType.TRUTH));

  const poopy = blob("Poopy", blobColor.ORANGE,
    clueColor({ type: "all" }, blobColor.ORANGE, blobType.TRUTH));

  const bottomSide = setGroupSide(blobGroup([dama, poopy]), groupSide.BOTTOM);
  console.log(padre.side);

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    liersAmount: liersAmount,
    groups: [leftSide, rightSide, bottomSide]
  };

}
