import { blobColor as col, blobType as type, groupSide as side } from "../constants/index.js";
import { clueAll, clueColor, clueSide, clueSpecific, newBlob } from "../blob/index.js";
import { Level } from "../types/blobTypes.js";

export function level1(): Level {
  const minimumLiers = 1;
  const maximumLiers = 3

  // Left Side
  // Fer: All Oranges tell the truth
  // Padre: Only 1 on the right tells the truth
  // Jonas: Mario lies

  const fer = newBlob("Fer", col.ORANGE,
    clueColor({ type: "all" }, col.ORANGE, type.TRUTH),
    side.LEFT);

  const padre = newBlob("Padre", col.ORANGE,
    clueSide({ type: "range", minimum: 1, maximum: 1 }, side.RIGHT, type.LIE),
    side.LEFT);

  const jonas = newBlob("Jonas", col.RED,
    clueSpecific("Mario", type.LIE),
    side.LEFT);


  // Right Side
  // Sipher: There are only 2 liers
  // Mario: There are only 3 liers
  // Bidu: At least 1 red Lies

  const sipher = newBlob("Sipher", col.RED,
    clueAll(2),
    side.RIGHT);

  const mario = newBlob("Mario", col.GREEN,
    clueAll(3),
    side.RIGHT);

  const bidu = newBlob("Bidu", col.BLUE,
    clueColor({ type: "some" }, col.RED, type.LIE),
    side.RIGHT);

  // Bottom Side
  // Dama: All bottoms tell the truth
  // Poopy: All oranges tell the truth

  const dama = newBlob("Dama", col.GREEN,
    clueSide({ type: "all" }, side.BOTTOM, type.TRUTH),
    side.BOTTOM);

  const poopy = newBlob("Poopy", col.ORANGE,
    clueColor({ type: "all" }, col.ORANGE, type.TRUTH),
    side.BOTTOM);

  const blobs = [fer, padre, jonas, sipher, mario, bidu, dama, poopy];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    blobs,
  };

}
