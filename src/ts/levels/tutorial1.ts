import { blobColor as col, blobType as type, groupSide as side, blobColor } from "../constants/index.js";
import { newBlob, clueAll, clueColor, clueSide, clueSpecific } from "../blob/index.js";
import { Level } from "../types/blobTypes.js";



export function tutorial1(): Level {
  const minimumLiers = 1;
  const maximumLiers = 1;
  const liersAmount = 1;;

  const left_0 = newBlob("Bob", col.BLUE,
    clueSpecific("Leozin", type.TRUTH),
    side.LEFT
  );

  const right_0 = newBlob("Leozin", col.GREEN,
    clueSpecific("Jaiminho", type.TRUTH),
    side.RIGHT
  );

  const left_1 = newBlob("Bielzinho", col.RED,
    clueSpecific("Jaiminho", type.LIE),
    side.LEFT
  );

  const right_1 = newBlob("Jaiminho", col.GREEN,
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
