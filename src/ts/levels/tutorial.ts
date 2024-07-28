import { blobColor as col, blobType as type, groupSide as side, blobColor } from "../constants/index.js";
import { blob, clueAll, clueColor, clueSide, clueSpecific } from "../blob/utils.js";
import { Level } from "../types/blobTypes.js";



export function tutorial(): Level {
  const minimumLiers = 1;
  const maximumLiers = 1;
  const liersAmount = 1;;

  const left_0 = blob("Bob", col.BLUE,
    clueSpecific("Leozin", type.TRUTH),
    side.LEFT
  );

  const right_0 = blob("Leozin", col.GREEN,
    clueSpecific("Jaiminho", type.TRUTH),
    side.RIGHT
  );

  const left_1 = blob("Bielzinho", col.RED,
    clueSpecific("Jaiminho", type.LIE),
    side.LEFT
  );

  const right_1 = blob("Jaiminho", col.GREEN,
    clueSpecific("Bielzinho", type.LIE),
    side.RIGHT
  );

  const blobs = [left_0, left_1, right_0, right_1];

  return {
    name: "Level 0",
    minimumLiers,
    maximumLiers,
    liersAmount,
    blobs,
  };

}
