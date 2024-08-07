import { blobColor as col, blobType as type, groupSide as side } from "../constants/index.js";
import { blob, clueAll, clueColor, clueSide, clueSpecific } from "../blob/utils.js";
import { Level } from "../types/blobTypes.js";



export function level_2(): Level {
  const minimumLiers = 1;
  const maximumLiers = 3
  const liersAmount = 2;

  // Left Side
  // James: There are 2 liars on the right
  // Mark: Only 1 on the bottom tells the truth
  // Marie: I tell the truth

  const james = blob("James", col.BLUE,
    clueSide({ type: "range", minimum: 2, maximum: 2 }, side.RIGHT, type.LIE),
    side.LEFT);

  const mark = blob("Mark", col.ORANGE,
    clueSide({ type: "range", minimum: 1, maximum: 1 }, side.BOTTOM, type.LIE),
    side.LEFT);

  const marie = blob("Marie", col.RED,
    clueSpecific("Marie", type.TRUTH),
    side.LEFT);


  // Right Side
  // Sipher: There are only 2 liars
  // Smith: There are no red liars
  // Roxy: There is 1 blue Liar

  const sipher = blob("Sipher", col.GREEN,
    clueAll(2, type.LIE),
    side.RIGHT);

  const smith = blob("Smith", col.BLUE,
    clueColor({ type: "all" }, col.RED, type.TRUTH),
    side.RIGHT);

  const roxy = blob("Roxy", col.BLUE,
    clueColor({ type: "range", minimum: 1, maximum: 1 }, col.BLUE, type.LIE),
    side.RIGHT);

  // Bottom Side
  // Lady: There is no green liars
  // Poopy: There is one green liar

  const lady = blob("Lady", col.GREEN,
    clueColor({ type: "all" }, col.GREEN, type.TRUTH),
    side.BOTTOM);

  const poppy = blob("Poppy", col.ORANGE,
    clueColor({ type: "range", minimum: 1, maximum: 1 }, col.GREEN, type.LIE),
    side.BOTTOM);

  const blobs = [james, mark, marie, sipher, smith, roxy, lady, poppy];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    liersAmount,
    blobs,
  };

}
