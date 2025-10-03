import type { AxialCoordinates, FacingDirection, PixelCoordinates } from "../types/index.js";

/**
 * Hexagonal utilities adapted from champion-wars-replay
 */

export function hexWidth(hexSize: number): number {
  return hexSize * Math.sqrt(3);
}

export function axialToPixel(axialCoords: AxialCoordinates, tileSize: number): PixelCoordinates {
  const { q, r } = axialCoords;
  const x = tileSize * Math.sqrt(3) * (q + r / 2);
  const y = ((tileSize * 3) / 2) * r;
  return { x, y };
}

export function offsetPixelCoord(
  pixelCoord: PixelCoordinates,
  viewportWidth: number,
  viewportHeight: number
): PixelCoordinates {
  return {
    x: pixelCoord.x + viewportWidth / 2,
    y: pixelCoord.y + viewportHeight / 2,
  };
}

export function generateAxialCoordinates(radius: number): AxialCoordinates[] {
  const coords: AxialCoordinates[] = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      coords.push({ q, r });
    }
  }
  return coords;
}

export function hashCoord(q: number, r: number): string {
  return `${q},${r}`;
}

export function createPixelCoordinatesFactory(
  tileSize: number,
  viewportWidth: number,
  viewportHeight: number
) {
  return (axialCoords: AxialCoordinates) =>
    offsetPixelCoord(axialToPixel(axialCoords, tileSize), viewportWidth, viewportHeight);
}

/**
 * Determines the facing direction based on the change in axial coordinates.
 * Characters face towards the direction they are moving or acting.
 *
 * @param fromCoords - Starting position
 * @param toCoords - Target position
 * @returns "left" if moving/acting towards lower q values, "right" if towards higher q values
 */
export function getFacingDirection(
  fromCoords: AxialCoordinates,
  toCoords: AxialCoordinates,
  currentFacing: "right" | "left" = "right"
): FacingDirection {
  const deltaQ = toCoords.q - fromCoords.q;

  // If q is increasing (moving towards the right), face right
  // If q is decreasing (moving towards the left), face left
  // If no change in q, maintain current facing (default to right)
  if (deltaQ === 0) return currentFacing;
  return deltaQ > 0 ? "right" : "left";
}
