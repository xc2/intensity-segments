export function pointNodesToSegmentsJson(nodes: PointNode[]) {
  return JSON.stringify(nodes.map(({ point, intensity }) => [point, intensity]));
}

export interface PointNode {
  point: number;
  intensity: number;
}

export function pointNode(point: number, intensity: number): PointNode {
  return { point, intensity };
}
