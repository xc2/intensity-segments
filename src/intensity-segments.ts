import { getBinarySearch } from "./binary-search";

/**
 * The segment node shape of [segment, intensity]
 * @public
 */
export type SegmentNode = [number, number];

/**
 * A structure to manage segments intensity.
 * @public
 * @example
 * ```ts
 * const segments = new IntensitySegments();
 * segments.toString(); // "[]"
 * segments.add(10, 30, 1);
 * segments.toString(); // "[[10,1],[30,0]]"
 * segments.add(20, 40, 1);
 * segments.toString(); // "[[10,1],[20,2],[30,1],[40,0]]"
 * segments.add(10, 40, -1);
 * segments.toString(); // "[[20,1],[30,0]]"
 * segments.add(10, 40, -1);
 * segments.toString(); // "[[10,-1],[20,0],[30,-1],[40,0]]"
 * segments.set(10, 20, 0);
 * segments.toString(); // "[[30,-1],[40,0]]"
 * ```
 */
export class IntensitySegments {
  /**
   * with the binary search solution, we store the prepared segments directly
   * @internal
   */
  protected segments: SegmentNode[] = [];
  protected indexOf = getBinarySearch((seg: SegmentNode) => seg[0]);
  protected getValue(position: number) {
    return this.segments[position]?.[1] ?? 0;
  }

  /**
   * Set intensity to the segments with a setter
   * @param from - start of the segment
   * @param to - end of the segment
   * @param fn - the setter that takes the previous intensity and returns the new intensity
   * @returns the instance self
   */
  setWith(from: number, to: number, fn: (prev: number) => number) {
    if (this.segments.length === 0) {
      this.segments.push([from, fn(0)], [to, 0]);
      return this;
    }
    // find the start position of the new segment
    const left = this.indexOf(this.segments, from);
    // iterator pointer
    let right = left;
    // will be the intensity of the end of the segment
    let rightValue = this.getValue(right - 1);

    while (right < this.segments.length) {
      const [intensity, prev] = this.segments[right];
      if (intensity < to) {
        // mutate all existing segments in `[from, to)`
        this.segments[right][1] = fn(prev);
        rightValue = prev;
        right = right + 1;
      } else {
        break;
      }
    }

    // add the end segment if not existing already
    if (to !== this.segments[right]?.[0]) {
      this.segments.splice(right, 0, [to, rightValue]);
    }

    // add the start segment if not existing already
    if (from !== this.segments[left][0]) {
      this.segments.splice(left, 0, [from, fn(this.getValue(left - 1))]);
      right = right + 1;
    }
    // As `this.segments` is always prepared(at least in JavaScript),
    //   we can only compact the range of `[left, right]`
    this.merge(left, right);
    return this;
  }

  /**
   * Compact the segments list in range of `[left, right]`
   * @internal
   */
  protected merge(left: number, right: number) {
    while (right >= left) {
      if (this.getValue(right) === this.getValue(right - 1)) {
        this.segments.splice(right, 1);
      }
      right = right - 1;
    }
  }

  /**
   * Add intensity to the segments
   * @param from - start of the segment
   * @param to - end of the segment (exclusive)
   * @param amount - intensity to add
   * @returns the instance self
   * @public
   */
  add(from: number, to: number, amount: number) {
    return this.setWith(from, to, (prev) => prev + amount);
  }

  /**
   * Set intensity to the segments
   * @param from - start of the segment
   * @param to - end of the segment (exclusive)
   * @param amount - intensity to set
   * @returns the instance self
   * @public
   */
  set(from: number, to: number, amount: number) {
    return this.setWith(from, to, () => amount);
  }

  /**
   * Get the prepared intensity segments
   * @remarks
   * Only use this method when you need the raw segments list.
   *
   * For performance reason we don't clone another array so please never mutate the segments directly,
   *
   * @returns the segments
   * @public
   */
  valueOf() {
    return this.segments;
  }
  /**
   * Get the JSON shaped prepared intensity segments
   * @returns the string shaped segments
   * @public
   */
  toString() {
    // if the segments is expected to be huge,
    //   we should create the string by iterating the segments
    return JSON.stringify(this.segments);
  }
}
