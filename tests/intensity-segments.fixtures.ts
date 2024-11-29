import type { IntensitySegments } from "../src";
import { type PointNode, pointNode } from "./helpers";

interface SimpleAddCase {
  /**
   * each action is a tuple of [from, to, intensity]
   * tuples will be passed to `IntensitySegments.add` one by one
   * @internal
   */
  actions: Parameters<IntensitySegments["add"]>[];
  result: PointNode[];
}

export const simpleAddCases: Record<string, SimpleAddCase> = {
  "left outside of left": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [-10, 40, 2],
    ],
    result: [
      pointNode(-10, 2), // [-10, 10) 2
      pointNode(10, 3), // [10, 30) 3
      pointNode(30, 2), // [30, 40) 2
      pointNode(40, 0),
    ],
  },
  "left existing": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [10, 40, 2],
    ],
    result: [
      pointNode(10, 3), // [10, 30) 3
      pointNode(30, 2), // [30, 40) 2
      pointNode(40, 0),
    ],
  },
  "left inside": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [20, 40, 2],
    ],
    result: [
      pointNode(10, 1), // [10, 20) 1
      pointNode(20, 3), // [20, 30) 3
      pointNode(30, 2), // [30, 40) 2
      pointNode(40, 0),
    ],
  },
  "left outside of right": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [40, 50, 2],
    ],
    result: [
      pointNode(10, 1), // [10, 30) 1
      pointNode(30, 0), // [30, 40) 0
      pointNode(40, 2), // [40, 50) 2
      pointNode(50, 0),
    ],
  },
  "right outside of left": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [-10, 0, 2],
    ],
    result: [
      pointNode(-10, 2), // [-10, 0) 2
      pointNode(0, 0),
      pointNode(10, 1), // [10, 30) 1
      pointNode(30, 0),
    ],
  },
  "right existing": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [0, 30, 2],
    ],
    result: [
      pointNode(0, 2), // [0, 10) 2
      pointNode(10, 3), // [10, 30) 3
      pointNode(30, 0),
    ],
  },
  "right inside": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [0, 20, 2],
    ],
    result: [
      pointNode(0, 2), // [0, 10) 2
      pointNode(10, 3), // [10, 20) 3
      pointNode(20, 1), // [20, 30) 1
      pointNode(30, 0),
    ],
  },
  "right outside of right": {
    actions: [
      [10, 30, 1], // [10, 30) 1
      [0, 50, 2],
    ],
    result: [
      pointNode(0, 2), // [0, 10) 2
      pointNode(10, 3), // [10, 30) 3
      pointNode(30, 2), // [30, 50) 2
      pointNode(50, 0),
    ],
  },
};
