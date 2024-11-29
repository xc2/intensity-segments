import { describe, expect, test } from "bun:test";
import { IntensitySegments } from "../src";
import { pointNode, pointNodesToSegmentsJson } from "./helpers";
import { simpleAddCases } from "./intensity-segments.fixtures";

describe("IntensitySegments", () => {
  test("initial value and basic case", () => {
    const segments = new IntensitySegments();
    expect(segments.toString()).toBe("[]");
    segments.add(10, 20, 1);
    expect(segments.toString()).toBe("[[10,1],[20,0]]");
  });
  test.each(Object.keys(simpleAddCases))("#add: %s", (key) => {
    const segments = new IntensitySegments();
    const c = simpleAddCases[key];
    for (const args of c.actions) {
      segments.add(...args);
    }
    expect(segments.toString()).toBe(pointNodesToSegmentsJson(c.result));
  });
  test("zero-intensity point of left boundary should be removed", () => {
    const segments = new IntensitySegments();
    segments.add(10, 30, 1);
    segments.add(20, 40, 1); // [[10,1],[20,2],[30,1],[40,0]]
    segments.add(10, 40, -1); // [[10,0],[20,1],[30,0],[40,0]]
    //                             ^^^^                ^^^^^ unnecessary
    expect(segments.toString()).toBe(
      pointNodesToSegmentsJson([pointNode(20, 1), pointNode(30, 0)])
    );
  });

  test("unnecessary points inside should be removed", () => {
    const segments = new IntensitySegments();
    segments.add(10, 40, 2);
    segments.add(20, 30, 1); // [[10,2],[20,3],[30,2],[40,0]]
    segments.add(20, 30, -1); // [[10,2],[20,2],[30,2],[40,0]]
    //                                   ^^^^^^^^^^^^^ unnecessary
    expect(segments.toString()).toBe(
      pointNodesToSegmentsJson([pointNode(10, 2), pointNode(40, 0)])
    );
  });

  // most cases are covered by `#add: %s`, so we only test the edge cases for `#set` here
  test("#set: basic", () => {
    const segments = new IntensitySegments();
    segments.add(10, 40, 2);
    segments.add(20, 30, 1); // [[10,2],[20,3],[30,2],[40,0]]
    segments.set(20, 30, 2); // [[10,2],[20,2],[30,2],[40,0]]
    //                                  ^^^^^ [20,30) is set to `2`
    expect(segments.toString()).toBe(
      pointNodesToSegmentsJson([pointNode(10, 2), pointNode(40, 0)])
    );
  });

  test("#set: merge", () => {
    const segments = new IntensitySegments();
    segments.add(10, 40, 2);
    segments.add(20, 30, 1); // [[10,2],[20,3],[30,2],[40,0]]
    segments.set(10, 40, 1); // [[10,1],[20,1],[30,1],[40,0]]
    //                           ^^^^^^^^^^^^^^^^^^^ [10,40) is set to `1`
    expect(segments.toString()).toBe(
      pointNodesToSegmentsJson([pointNode(10, 1), pointNode(40, 0)])
    );
  });
});
