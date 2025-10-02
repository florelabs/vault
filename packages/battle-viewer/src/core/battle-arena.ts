import {
  type Application,
  Assets,
  Container,
  Sprite,
  type Spritesheet,
  type Texture,
} from "pixi.js";
import type { ArenaConfig, AxialCoordinates, BattleParticipant, HexTile } from "../types/index.js";
import {
  createPixelCoordinatesFactory,
  generateAxialCoordinates,
  hashCoord,
} from "../utils/hex.js";
import { BattleCharacter } from "./battle-character.js";

const DEFAULT_TILE_TEXTURES: Record<string, string> = {
  grass: "hex_grass.png",
  water: "hex_water.png",
  mountain: "hex_mountain.png",
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

  private tileSpritesheet: Spritesheet | null = null;
  private getPixelCoordinates: (coords: AxialCoordinates) => { x: number; y: number };

  constructor(app: Application, config: ArenaConfig) {
    this.app = app;
    this.config = {
      viewportWidth: app.canvas.width,
      viewportHeight: app.canvas.height,
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
    this.generateTiles();
    this.renderTiles();
  }

  private async loadAssets(): Promise<void> {
    if (this.config.tileSpritesheet) {
      try {
        this.tileSpritesheet = await Assets.load(this.config.tileSpritesheet);
      } catch (error) {
        console.warn("Could not load tile spritesheet:", error);
      }
    }
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

      if (this.tileSpritesheet) {
        // Resolve texture by explicit name or index, else default by type mapping
        const namePref = this.config.tileTextureName;
        if (namePref && this.tileSpritesheet.textures[namePref]) {
          texture = this.tileSpritesheet.textures[namePref];
        } else if (
          typeof this.config.tileTextureIndex === "number" &&
          this.config.tileTextureIndex >= 0
        ) {
          const names = Object.keys(this.tileSpritesheet.textures);
          const idx = Math.min(this.config.tileTextureIndex, names.length - 1);
          texture = this.tileSpritesheet.textures[names[idx]] || null;
        } else {
          const textureName = DEFAULT_TILE_TEXTURES[tile.type];
          texture = this.tileSpritesheet.textures[textureName] || null;
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
    const pixelCoords = this.getPixelCoordinates(participant.initialPosition);

    const character = new BattleCharacter(
      participant.id,
      pixelCoords,
      participant.spriteConfig,
      participant.weaponId
    );

    console.log(`[BattleArena] Adding character ${participant.id} at`, pixelCoords);
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
    // Reinitialize if needed
    this.getPixelCoordinates = createPixelCoordinatesFactory(
      this.config.tileSize,
      this.config.viewportWidth ?? 800,
      this.config.viewportHeight ?? 600
    );
  }

  getTileAt(coords: AxialCoordinates): HexTile | null {
    const hash = hashCoord(coords.q, coords.r);
    return this.tiles.get(hash) || null;
  }

  getAllTiles(): HexTile[] {
    return [...this.tilesById];
  }
}
