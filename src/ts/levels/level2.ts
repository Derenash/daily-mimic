import { blobColor as col, blobType as type, groupSide as side } from "../constants/index.js";
import { clueAll, clueColor, clueSide, clueSpecific, newBlob } from "../blob/index.js";
import { Level } from "../types/blobTypes.js";

export function level2(): Level {
  const minimumLiers = 1;
  const maximumLiers = 3

  // Left Side
  // James: There are 2 liars on the right
  // Mark: Only 1 on the bottom tells the truth
  // Marie: I tell the truth

  const james = newBlob("James", col.BLUE,
    clueSide({ type: "range", minimum: 2, maximum: 2 }, side.RIGHT, type.LIE),
    side.LEFT);

  const mark = newBlob("Mark", col.ORANGE,
    clueSide({ type: "range", minimum: 1, maximum: 1 }, side.BOTTOM, type.LIE),
    side.LEFT);

  const marie = newBlob("Marie", col.RED,
    clueSpecific("Marie", type.TRUTH),
    side.LEFT);


  // Right Side
  // Sipher: There are only 2 liars
  // Smith: There are no red liars
  // Roxy: There is 1 blue Liar

  const sipher = newBlob("Sipher", col.GREEN,
    clueAll(2),
    side.RIGHT);

  const smith = newBlob("Smith", col.BLUE,
    clueColor({ type: "all" }, col.RED, type.TRUTH),
    side.RIGHT);

  const roxy = newBlob("Roxy", col.BLUE,
    clueColor({ type: "range", minimum: 1, maximum: 1 }, col.BLUE, type.LIE),
    side.RIGHT);

  // Bottom Side
  // Lady: There is no green liars
  // Poopy: There is one green liar

  const lady = newBlob("Lady", col.GREEN,
    clueColor({ type: "all" }, col.GREEN, type.TRUTH),
    side.BOTTOM);

  const poppy = newBlob("Poppy", col.ORANGE,
    clueColor({ type: "range", minimum: 1, maximum: 1 }, col.GREEN, type.LIE),
    side.BOTTOM);

  const blobs = [james, mark, marie, sipher, smith, roxy, lady, poppy];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    blobs,
  };

}
