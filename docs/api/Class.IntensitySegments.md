[@109cafe/intensity-segments](index.md) / IntensitySegments

# Class: IntensitySegments

A structure to manage segments intensity.

## Example

```ts
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

## Constructors

### new IntensitySegments()

```ts
new IntensitySegments(): IntensitySegments
```

#### Returns

[`IntensitySegments`](Class.IntensitySegments.md)

## Methods

### add()

```ts
add(
   from: number, 
   to: number, 
   amount: number): IntensitySegments
```

Add intensity to the segments

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `from` | `number` | start of the segment |
| `to` | `number` | end of the segment (exclusive) |
| `amount` | `number` | intensity to add |

#### Returns

[`IntensitySegments`](Class.IntensitySegments.md)

the instance self

***

### set()

```ts
set(
   from: number, 
   to: number, 
   amount: number): IntensitySegments
```

Set intensity to the segments

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `from` | `number` | start of the segment |
| `to` | `number` | end of the segment (exclusive) |
| `amount` | `number` | intensity to set |

#### Returns

[`IntensitySegments`](Class.IntensitySegments.md)

the instance self

***

### setWith()

```ts
setWith(
   from: number, 
   to: number, 
   fn: (prev: number) => number): IntensitySegments
```

Set intensity to the segments with a setter

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `from` | `number` | start of the segment |
| `to` | `number` | end of the segment |
| `fn` | (`prev`: `number`) => `number` | the setter that takes the previous intensity and returns the new intensity |

#### Returns

[`IntensitySegments`](Class.IntensitySegments.md)

the instance self

***

### toString()

```ts
toString(): string
```

Get the JSON shaped prepared intensity segments

#### Returns

`string`

the string shaped segments

***

### valueOf()

```ts
valueOf(): SegmentNode[]
```

Get the prepared intensity segments

#### Returns

[`SegmentNode`](TypeAlias.SegmentNode.md)[]

the segments

#### Remarks

Only use this method when you need the raw segments list.

For performance reason we don't clone another array so please never mutate the segments directly,
