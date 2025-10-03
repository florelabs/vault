import type { Texture } from "pixi.js";

/**
 * Core types for battle-viewer
 */

export interface BattleTurn {
  id: string;
  timestamp: number;
  actions: BattleAction[];
}

export interface BattleAction {
  type: "move" | "attack" | "skill" | "effect";
  actor: string;
  target?: string;
  position?: AxialCoordinates;
  path?: AxialCoordinates[];
  data?: Record<string, unknown>;
}

export interface BattleData {
  turns: BattleTurn[];
  participants: BattleParticipant[];
}

export interface BattleParticipant {
  id: string;
  name: string;
  initialPosition: AxialCoordinates;
  spriteConfig?: SpriteConfig;
  weaponId?: number | null;
}

export type FacingDirection = "left" | "right";

export interface CharacterFacingConfig {
  /** Default facing direction for the sprite (most sprites face right by default) */
  defaultFacing?: FacingDirection;
  /** Whether this character's sprite should be mirrored when facing the opposite direction */
  allowMirroring?: boolean;
}

/**
 * Tile textures can be provided as:
 * - Record<string, Texture>: Pre-loaded textures (recommended for full control)
 * - string: URL to a spritesheet JSON
 * - string[]: Array of URLs to spritesheet JSONs (for multipacks)
 */
export type TileTextureSource = Record<string, Texture> | string | string[];

export interface ArenaConfig {
  radius: number;
  tileSize: number;
  backgroundColor: number;
  viewportWidth?: number;
  viewportHeight?: number;
  /** @deprecated Use tileTextures instead for better control */
  tileSpritesheet?: string;
  /** @deprecated Use tileTextures instead for better control */
  tileSpritesheets?: string[];
  /** Tile textures - can be pre-loaded Texture map or URL(s) to load */
  tileTextures?: TileTextureSource;
  /** Name of the default tile texture in the tiles atlas (e.g., "hexPlains00.png") */
  tileTextureName?: string;
  /** Index of the default tile texture in the tiles atlas (fallback if name not provided) */
  tileTextureIndex?: number;
  /** Terrain map defining what terrain type each hex should use */
  terrainMap?: TerrainMap;
}

/**
 * Terrain map that defines the terrain type for specific coordinates
 * If a coordinate is not specified, the default tile texture is used
 */
export interface TerrainMap {
  /** Map of coordinate string (e.g., "1,2") to terrain definition */
  [coordinateKey: string]: TerrainDefinition;
}

/**
 * Definition of terrain at a specific hex position
 */
export interface TerrainDefinition {
  /** Type of terrain (e.g., "forest", "mountain", "water") */
  type: string;
  /** Specific sprite texture name from the atlas (e.g., "hexForestPine00.png") */
  spriteId: string;
  /** Optional properties for terrain behavior */
  properties?: TerrainProperties;
}

/**
 * Properties that define how terrain behaves
 */
export interface TerrainProperties {
  /** Whether characters can move through this terrain */
  passable?: boolean;
  /** Whether projectiles can pass through this terrain */
  blocksProjectiles?: boolean;
  /** Whether this terrain blocks line of sight */
  blocksVision?: boolean;
  /** Movement cost multiplier for pathfinding */
  movementCost?: number;
  /** Custom properties for specific terrain types */
  [key: string]: unknown;
}

/**
 * Character sprite configuration.
 * spritesheet can be either a URL string or a pre-loaded Spritesheet object
 */
export interface SpriteConfig {
  spritesheet: string;
  animations?: AnimationConfig;
  /** Map logical actions to atlas animation keys (e.g., idle: "fighter_Idle") */
  animationMap?: Partial<Record<AnimationName, string>>;
  size: { width: number; height: number };
  anchor?: { x: number; y: number };
  /** Configuration for character facing direction */
  facingConfig?: CharacterFacingConfig;
}

export interface AnimationConfig {
  idle: AnimationData;
  run?: AnimationData;
  attack?: AnimationData;
  hit?: AnimationData;
  [key: string]: AnimationData | undefined;
}

export interface AnimationData {
  speed: number;
  loop: boolean;
}

// Re-export for typing in configs
export type AnimationName = "idle" | "run" | "attack" | "hit";

export interface AxialCoordinates {
  q: number;
  r: number;
}

export interface PixelCoordinates {
  x: number;
  y: number;
}

export interface HexTile {
  id: number;
  type: string;
  position: AxialCoordinates;
  pixelCoords: PixelCoordinates;
}
