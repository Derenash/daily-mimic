import { blobColor as col, blobType as type, groupSide as side } from "../constants/index.js";
import { newBlob, clueColor, clueSide } from "../blob/index.js";
import { Level } from "../types/blobTypes.js";



export function tutorial2(): Level {
  const minimumLiers = 1;
  const maximumLiers = 1;
  const liersAmount = 1;;

  const left_0 = newBlob("Bielzinho", col.RED,
    clueColor({ type: "all" }, col.BLUE, type.TRUTH),
    side.LEFT
  );

  const right_0 = newBlob("Jaiminho", col.BLUE,
    clueSide({ type: "some" }, side.BOTTOM, type.LIE),
    side.RIGHT
  );

  const bottom_0 = newBlob("Bob", col.RED,
    clueColor({ type: "some" }, col.BLUE, type.LIE),
    side.BOTTOM
  );

  const bottom_1 = newBlob("Leozin", col.BLUE,
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
