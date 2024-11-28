# @109cafe/intensity-segments

This is a simple library to manage intensity segments.

## Installation

```bash
npm add @109cafe/intensity-segmenets
```

## Basic Example

```ts
import { IntensitySegments } from '@109cafe/intensity-segments';
const segments = new IntensitySegments();
segments.toString(); // "[]"
segments.add(10, 30, 1);
segments.toString(); // "[[10,1],[30,0]]"
segments.add(20, 40, 1);
segments.toString(); // "[[10,1],[20,2],[30,1],[40,0]]"
segments.add(10, 40, -1);
segments.toString(); // "[[20,1],[30,0]]"
segments.add(10, 40, -1);
segments.toString(); // "[[10,-1],[20,0],[30,-1],[40,0]]"
segments.set(10, 20, 0);
segments.toString(); // "[[30,-1],[40,0]]"
```

## Core API References

For full API references, please refer to the [API References](docs/api/index.md).

### `IntensitySegments#add(from: number, to: number, amount: number)`

To add specific amount of intensity to the segments in the range of `[from, to)`. E.g.,

- `[[10,1],[30,0]]` + `.add(20, 40, 1)` -> `[[10,1],[20,2],[30,1],[40,0]]`
- `[[10,1],[30,0]]` + `.add(10, 20, 1)` -> `[[10,2],[20,1],[30,0]]`

The final segments list will be automatically compacted if possible. E.g.,

- `[[10,1],[20,1],[30,0]]` -> `[[10,1],[30,0]]`

### `IntensitySegments#set(from: number, to: number, amount: number)`

To set the exact intensity to the segments in the range of `[from, to)`.

The final segments list will be automatically compacted as well.

## Legacy Browsers and Runtimes

This package is targeting ES2020 which is fine for most modern browsers and runtimes.

To targeting a legacy browser or runtime, you need a modern bundler like Webpack, Rollup, etc.

An example for webpack/rspack:

```ts
module.exports = {
  // ...
  resolve: {
    importsFields: ['legacy', 'browser', 'module', 'main'],
  }
  // ...
}
```

## Develop

See the [DEVELOP.md](./DEVELOP.md) for more details.


