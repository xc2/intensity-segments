import { SortedNumberList } from "./structures/sorted-number-list";

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
   * An array to store the points of the segments
   * @protected
   */
  protected points = new SortedNumberList();
  /**
   * A `<point, intensity>` map
   * @protected
   */
  protected intensities = new Map<number, number>();

  /**
   * Set intensity to the segments with a mutator
   * @param from - start of the segment
   * @param to - end of the segment
   * @param mutator - the setter that takes the previous intensity and returns the new intensity
   * @returns the instance self
   */
  setWith(from: number, to: number, mutator: (prev: number) => number) {
    /**
     * 1. Insert the `from` and `to` points into the segment
     * @example
     * Initial:
     *      P0         P1        // position
     * -----10---------20-----   // segment
     *      ^2         ^0        // intensity
     * `insertAt(15)` to initial:
     *      P0    P1   P2        // position
     * -----10----15---20------  // segment
     *      ^2    ^2   ^0        // intensity
     */
    const fromPosition = this.insert(from);
    const toPosition = this.insert(to, fromPosition + 1);

    /**
     * 2. Mutate the intensity of the range of `[fromPosition, toPosition)`
     * @example
     * Initial:
     *  [F         T)            // position, F is fromPosition, T is toPosition
     * --0---10----15---20------  // segment
     *   ^1  ^2    ^2   ^0        // intensity
     * mutator: (prev) => prev + 1
     *  [F         T)            // position, F is fromPosition, T is toPosition
     * --0---10----15---20------  // segment
     *   ^2  ^3    ^2   ^0        // intensity
     */
    for (let i = fromPosition; i < toPosition; i++) {
      const point = this.points.at(i);
      const intensity = mutator(this.getIntensity(i));
      this.intensities.set(point, intensity);
    }

    /**
     *  3. Compact the segments in range of `[fromPosition, toPosition]`
     *  @example
     *      P0    P1   P2        // position
     * -----10----15---20------  // segment
     *      ^2    ^2   ^0        // intensity
     *  After merge
     *      P0         P1        // position
     * -----10---------20------  // segment
     *      ^2         ^0        // intensity
     */
    this.merge(fromPosition, toPosition);

    return this;
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
   *
   * @returns the segments
   * @public
   */
  valueOf() {
    return this.points.valueOf().map((point) => [point, this.intensities.get(point)]);
  }
  /**
   * Get the JSON shaped prepared intensity segments
   * @returns the string shaped segments
   * @public
   */
  toString() {
    // if the segments is expected to be huge,
    //   we should create the string by iterating the segments manually
    return JSON.stringify(this.valueOf());
  }

  /**
   * Reflect a point in the segments
   * @internal
   */
  protected insert(point: number, left = 0) {
    const position = this.points.insert(point, left);
    if (!this.intensities.has(point)) {
      // calc and store the intensity of the point to ensure every point has a known intensity
      this.intensities.set(point, this.getIntensity(position));
    }
    return position;
  }

  /**
   * Compact the segments list in range of `[fromPosition, toPosition]`
   * @internal
   */
  protected merge(fromPosition: number, toPosition: number) {
    let cursor = toPosition;
    while (cursor >= fromPosition) {
      const point = this.points.at(cursor);
      if (this.getIntensity(cursor) === this.getIntensity(cursor - 1)) {
        this.points.remove(cursor);
        this.intensities.delete(point);
      }
      cursor = cursor - 1;
    }
  }

  /**
   * Get the intensity of a point in the segments
   * @param position
   * @protected
   */
  protected getIntensity(position: number) {
    let cursor = position;
    // backward to the first point that has known intensity
    // this iteration is expected to be fast as everytime we insert a point, we update its intensity
    while (cursor > -1) {
      const point = this.points.at(cursor);
      const intensity = this.intensities.get(point);
      if (intensity !== undefined) {
        return intensity;
      }
      cursor = cursor - 1;
    }
    return 0;
  }
}
