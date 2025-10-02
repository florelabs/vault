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

export interface ArenaConfig {
  radius: number;
  tileSize: number;
  backgroundColor: number;
  viewportWidth?: number;
  viewportHeight?: number;
  tileSpritesheet?: string;
  /** Name of the default tile texture in the tiles atlas (e.g., "hex_grass.png") */
  tileTextureName?: string;
  /** Index of the default tile texture in the tiles atlas (fallback if name not provided) */
  tileTextureIndex?: number;
}

export interface SpriteConfig {
  spritesheet: string;
  animations?: AnimationConfig;
  /** Map logical actions to atlas animation keys (e.g., idle: "fighter_Idle") */
  animationMap?: Partial<Record<AnimationName, string>>;
  size?: { width: number; height: number };
  anchor?: { x: number; y: number };
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
