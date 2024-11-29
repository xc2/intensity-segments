/**
 * A typical sorted number list
 * @internal
 */
export class SortedNumberList {
  protected items: number[] = [];

  search(target: number, left = 0, right = this.items.length - 1) {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = this.items[mid];

      if (item === target) {
        return mid;
      } else if (item < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return left;
  }

  at(position: number) {
    return this.items[position];
  }

  insert(target: number, left = 0, right = this.items.length - 1) {
    const position = this.search(target, left, right);
    if (this.at(position) === target) {
      return position;
    }
    this.items.splice(position, 0, target);
    return position;
  }

  /**
   * remove a node at a given position
   * @param position
   * @returns the removed node
   * @public
   */
  remove(position: number) {
    const [item] = this.items.splice(position, 1);
    return item;
  }

  valueOf() {
    return this.items;
  }
}
