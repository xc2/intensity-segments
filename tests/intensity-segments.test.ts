import { describe, expect, test } from "bun:test";
import { IntensitySegments } from "../src";
import { simpleAddCases } from "./intensity-segments.fixtures";

describe("IntensitySegments", () => {
  test("initial value", () => {
    expect(new IntensitySegments().toString()).toBe("[]");
  });
  test.each(Object.keys(simpleAddCases))("#add %s", (key) => {
    const segments = new IntensitySegments();
    const c = simpleAddCases[key];
    const expected = c.pop();
    const addes = c as Parameters<IntensitySegments["add"]>[];
    for (const add of addes) {
      segments.add(...add);
    }
    expect(segments.toString()).toBe(JSON.stringify(expected));
  });
  test("merge: boundary", () => {
    const segments = new IntensitySegments();
    segments.add(10, 30, 1);
    segments.add(20, 40, 1); // [[10,1],[20,2],[30,1],[40,0]]
    segments.add(10, 40, -1);
    expect(segments.toString()).toBe(
      JSON.stringify([
        [20, 1],
        [30, 0],
      ])
    );
  });

  test("merge: inside", () => {
    const segments = new IntensitySegments();
    segments.add(10, 40, 2);
    segments.add(20, 30, 1); // [[10,2],[20,3],[30,2],[40,0]]
    segments.add(20, 30, -1);
    expect(segments.toString()).toBe(
      JSON.stringify([
        [10, 2],
        [40, 0],
      ])
    );
  });

  test("#set", () => {
    const segments = new IntensitySegments();
    segments.add(10, 40, 2);
    segments.add(20, 30, 1); // [[10,2],[20,3],[30,2],[40,0]]
    segments.set(20, 30, 2);
    expect(segments.toString()).toBe(
      JSON.stringify([
        [10, 2],
        [40, 0],
      ])
    );
  });

  test("#set: merge", () => {
    const segments = new IntensitySegments();
    segments.add(10, 40, 2);
    segments.add(20, 30, 1); // [[10,2],[20,3],[30,2],[40,0]]
    segments.set(10, 40, 1);
    expect(segments.toString()).toBe(
      JSON.stringify([
        [10, 1],
        [40, 0],
      ])
    );
  });
});
