import { blobColor as col, blobType as type, groupSide as side, blobColor } from "../constants/index.js";
import { blob, clueAll, clueColor, clueSide, clueSpecific } from "../blob/utils.js";
import { Level } from "../types/blobTypes.js";



export function tutorial2(): Level {
  const minimumLiers = 1;
  const maximumLiers = 1;
  const liersAmount = 1;;

  const left_0 = blob("Bielzinho", col.RED,
    clueColor({ type: "all" }, col.BLUE, type.TRUTH),
    side.LEFT
  );

  const right_0 = blob("Jaiminho", col.BLUE,
    clueSide({ type: "some" }, side.BOTTOM, type.LIE),
    side.RIGHT
  );

  const bottom_0 = blob("Bob", col.RED,
    clueColor({ type: "some" }, col.BLUE, type.LIE),
    side.BOTTOM
  );

  const bottom_1 = blob("Leozin", col.BLUE,
    clueSide({ type: "some" }, side.BOTTOM, type.LIE),
    side.BOTTOM
  );


  const blobs = [left_0, right_0, bottom_0, bottom_1];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    liersAmount,
    blobs,
  };

}
