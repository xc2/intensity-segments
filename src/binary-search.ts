/**
 * create a binary search function
 * @private
 * @param pick - pick the number from each item of array
 * @returns the number to compare
 */
export function getBinarySearch<T>(pick: (item: T) => number) {
  /**
   * A typical binary search
   * @internal
   * @param arr - the array to search
   * @param target - the target number to search
   * @returns the position of the target to insert
   */
  return (arr: T[], target: number): number => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = pick(arr[mid]);

      if (item === target) {
        return mid;
      } else if (item < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return left;
  };
}
