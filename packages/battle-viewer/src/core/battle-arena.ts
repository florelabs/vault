import { type Application, Assets, Container, Sprite, type Texture } from "pixi.js";
import type {
  ArenaConfig,
  AxialCoordinates,
  BattleParticipant,
  HexTile,
  TerrainDefinition,
  TerrainMap,
} from "../types/index.js";
import {
  createPixelCoordinatesFactory,
  generateAxialCoordinates,
  hashCoord,
} from "../utils/hex.js";
import { BattleCharacter } from "./battle-character.js";

const DEFAULT_TILE_TEXTURES: Record<string, string> = {
  grass: "hexPlains00.png",
  water: "hexOcean00.png",
  mountain: "hexMountain00.png",
};

export class BattleArena {
  private app: Application;
  private config: ArenaConfig;
  private container: Container;
  private tilesContainer: Container;
  private charactersContainer: Container;

  private tiles = new Map<string, HexTile>();
  private tilesById: HexTile[] = [];
  private characters = new Map<string, BattleCharacter>();
  private terrainMap: TerrainMap = {};

  private allTextures: Record<string, Texture> = {};
  private getPixelCoordinates: (coords: AxialCoordinates) => { x: number; y: number };

  constructor(app: Application, config: ArenaConfig) {
    this.app = app;
    const rendererWidth =
      (app.renderer?.width as number) || (app.canvas as HTMLCanvasElement).clientWidth || 800;
    const rendererHeight =
      (app.renderer?.height as number) || (app.canvas as HTMLCanvasElement).clientHeight || 600;
    this.config = {
      viewportWidth: rendererWidth,
      viewportHeight: rendererHeight,
      ...config,
    };

    this.container = new Container();
    this.tilesContainer = new Container();
    this.charactersContainer = new Container();

    this.container.addChild(this.tilesContainer);
    this.container.addChild(this.charactersContainer);
    this.app.stage.addChild(this.container);

    this.getPixelCoordinates = createPixelCoordinatesFactory(
      this.config.tileSize,
      this.config.viewportWidth ?? 800,
      this.config.viewportHeight ?? 600
    );
  }

  async initialize(): Promise<void> {
    await this.loadAssets();
    this.loadTerrainMap();
    this.generateTiles();
    this.renderTiles();
  }

  private async loadAssets(): Promise<void> {
    // Reset textures
    this.allTextures = {};

    // Determine texture source - priority: tileTextures > tileSpritesheets > tileSpritesheet
    const textureSource =
      this.config.tileTextures ?? this.config.tileSpritesheets ?? this.config.tileSpritesheet;

    if (!textureSource) {
      return;
    }

    try {
      // If textures are already loaded (Record<string, Texture>)
      if (typeof textureSource === "object" && !Array.isArray(textureSource)) {
        this.allTextures = textureSource;
        console.log(
          `[BattleArena] Using ${Object.keys(this.allTextures).length} pre-loaded textures`
        );
        return;
      }

      // If URLs are provided (string or string[])
      const urls = Array.isArray(textureSource) ? textureSource : [textureSource];

      // Load all spritesheets
      const loadedSheets = await Promise.all(urls.map((url) => Assets.load(url)));

      // Merge all textures from all spritesheets into a single lookup
      for (const sheet of loadedSheets) {
        Object.assign(this.allTextures, sheet.textures);
      }

      console.log(
        `[BattleArena] Loaded ${urls.length} spritesheet(s) with ${Object.keys(this.allTextures).length} total textures`
      );
    } catch (error) {
      console.error("[BattleArena] Could not load tile textures:", error);
    }
  }

  private loadTerrainMap(): void {
    this.terrainMap = this.config.terrainMap || {};
  }

  private generateTiles(): void {
    const coords = generateAxialCoordinates(this.config.radius);

    coords.forEach((coord, index) => {
      const pixelCoords = this.getPixelCoordinates(coord);
      const tile: HexTile = {
        id: index,
        type: "grass", // Default type
        position: coord,
        pixelCoords,
      };

      const hash = hashCoord(coord.q, coord.r);
      this.tiles.set(hash, tile);
      this.tilesById.push(tile);
    });
  }

  private renderTiles(): void {
    const sprites: Sprite[] = [];
    for (const tile of this.tilesById) {
      let texture: Texture | null = null;

      if (Object.keys(this.allTextures).length > 0) {
        // Check if there's custom terrain for this tile position
        const terrainKey = hashCoord(tile.position.q, tile.position.r);
        const terrainDef = this.terrainMap[terrainKey];

        if (terrainDef) {
          // Use terrain-specific sprite from merged textures
          texture = this.allTextures[terrainDef.spriteId] || null;
          if (!texture) {
            console.warn(
              `[BattleArena] Texture not found for terrain sprite: ${terrainDef.spriteId}`
            );
          }
        } else {
          // Use default tile texture
          const namePref = this.config.tileTextureName;
          if (namePref && this.allTextures[namePref]) {
            texture = this.allTextures[namePref];
          } else if (
            typeof this.config.tileTextureIndex === "number" &&
            this.config.tileTextureIndex >= 0
          ) {
            const names = Object.keys(this.allTextures);
            const idx = Math.min(this.config.tileTextureIndex, names.length - 1);
            texture = this.allTextures[names[idx]] || null;
          } else {
            const textureName = DEFAULT_TILE_TEXTURES[tile.type];
            texture = this.allTextures[textureName] || null;
          }
        }
      }

      if (texture) {
        const sprite = new Sprite(texture);
        sprite.x = tile.pixelCoords.x;
        sprite.y = tile.pixelCoords.y;
        sprite.anchor.set(0.5);

        // Scale based on hex width
        const targetWidth = this.config.tileSize * Math.sqrt(3) * 1.2;
        sprite.width = targetWidth;
        sprite.height = targetWidth;

        this.tilesContainer.addChild(sprite);
        sprites.push(sprite);
      }
    }
    // If no texture resolved, draw nothing; future enhancement could draw vector hexes
  }

  async addCharacter(participant: BattleParticipant): Promise<void> {
    const character = new BattleCharacter(
      participant.id,
      participant.initialPosition, // Pass axial position directly
      this.getPixelCoordinates, // Pass the coordinate conversion factory
      participant.spriteConfig,
      participant.weaponId
    );

    console.log(
      `[BattleArena] Adding character ${participant.id} at axial`,
      participant.initialPosition
    );
    await character.initialize();
    console.log(`[BattleArena] Character ${participant.id} initialized`);

    this.characters.set(participant.id, character);
    this.charactersContainer.addChild(character.getContainer());
  }

  getCharacter(id: string): BattleCharacter | null {
    return this.characters.get(id) || null;
  }

  removeCharacter(id: string): void {
    const character = this.characters.get(id);
    if (character) {
      this.charactersContainer.removeChild(character.getContainer());
      character.destroy();
      this.characters.delete(id);
    }
  }

  clear(): void {
    // Clear characters
    for (const [id] of this.characters) {
      this.removeCharacter(id);
    }
    this.charactersContainer.removeChildren();

    // Clear tiles
    this.tiles.clear();
    this.tilesById = [];
    this.tilesContainer.removeChildren();

    // Clear terrain map
    this.terrainMap = {};

    // Reset textures so they get reloaded if config changes
    this.allTextures = {};
  }

  destroy(): void {
    this.clear();
    this.app.stage.removeChild(this.container);
    this.container.destroy();
  }

  getConfig(): ArenaConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<ArenaConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update the pixel coordinates factory with new config
    this.getPixelCoordinates = createPixelCoordinatesFactory(
      this.config.tileSize,
      this.config.viewportWidth ?? 800,
      this.config.viewportHeight ?? 600
    );
  }

  /**
   * Reinitialize the arena with current configuration
   * This will regenerate and re-render tiles and reload assets
   */
  async reinitialize(): Promise<void> {
    // Clear existing visual content
    this.clear();

    // Reload assets and regenerate tiles with new config
    await this.loadAssets();
    this.loadTerrainMap();
    this.generateTiles();
    this.renderTiles();
  }

  getTileAt(coords: AxialCoordinates): HexTile | null {
    const hash = hashCoord(coords.q, coords.r);
    return this.tiles.get(hash) || null;
  }

  getAllTiles(): HexTile[] {
    return [...this.tilesById];
  }

  /**
   * Get terrain definition at specific coordinates
   */
  getTerrainAt(coords: AxialCoordinates): TerrainDefinition | null {
    const terrainKey = hashCoord(coords.q, coords.r);
    return this.terrainMap[terrainKey] || null;
  }

  /**
   * Get all terrain definitions
   */
  getAllTerrain(): TerrainMap {
    return { ...this.terrainMap };
  }

  /**
   * Check if a position has custom terrain (not default)
   */
  hasCustomTerrainAt(coords: AxialCoordinates): boolean {
    return this.getTerrainAt(coords) !== null;
  }

  /**
   * Check if a position is passable (no blocking terrain)
   */
  isPassable(coords: AxialCoordinates): boolean {
    const terrain = this.getTerrainAt(coords);
    return terrain === null || terrain.properties?.passable !== false;
  }
}
