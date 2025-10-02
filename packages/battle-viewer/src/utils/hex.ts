import type { AxialCoordinates, PixelCoordinates } from "../types/index.js";

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
