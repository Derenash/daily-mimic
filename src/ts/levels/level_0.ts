import { blobColor as col, blobType as type, groupSide as side } from "../constants/index.js";
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

  const fer = blob("Fer", col.ORANGE,
    clueColor({ type: "all" }, col.ORANGE, type.TRUTH),
    side.LEFT);

  const padre = blob("Padre", col.ORANGE,
    clueSide({ type: "range", minimum: 1, maximum: 1 }, side.BOTTOM, type.LIE),
    side.LEFT);

  const jonas = blob("Jonas", col.RED,
    clueSpecific("Mario", type.LIE),
    side.LEFT);


  // Right Side
  // Sipher: There are only 2 liers
  // Mario: There are only 3 liers
  // Bidu: At least 1 red Lies

  const sipher = blob("Sipher", col.RED,
    clueAll(2, type.LIE),
    side.RIGHT);

  const mario = blob("Mario", col.GREEN,
    clueAll(3, type.LIE),
    side.RIGHT);

  const bidu = blob("Bidu", col.BLUE,
    clueColor({ type: "some" }, col.RED, type.LIE),
    side.RIGHT);

  // Bottom Side
  // Dama: All bottoms tell the truth
  // Poopy: All oranges tell the truth

  const dama = blob("Dama", col.GREEN,
    clueSide({ type: "all" }, side.BOTTOM, type.TRUTH),
    side.BOTTOM);

  const poopy = blob("Poopy", col.ORANGE,
    clueColor({ type: "all" }, col.ORANGE, type.TRUTH),
    side.BOTTOM);

  const blobs = [fer, padre, jonas, sipher, mario, bidu, dama, poopy];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    liersAmount,
    blobs,
  };

}
