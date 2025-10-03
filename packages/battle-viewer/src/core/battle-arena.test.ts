import { type Application, Assets } from "pixi.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ArenaConfig } from "../types/index.js";
import { BattleArena } from "./battle-arena.js";

describe("BattleArena - Asset Loading", () => {
  let app: Application;
  let mockTextures: Record<string, any>;

  beforeEach(() => {
    // Create a minimal mock app
    app = {
      stage: { addChild: vi.fn() },
      renderer: { width: 800, height: 600 },
      canvas: { clientWidth: 800, clientHeight: 600 },
    } as any;

    // Mock textures
    mockTextures = {
      "hexPlains00.png": { label: "plains" },
      "hexForest00.png": { label: "forest" },
      "hexMountain00.png": { label: "mountain" },
    };
  });

  describe("Pre-loaded Textures", () => {
    it("should accept pre-loaded textures directly", async () => {
      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: mockTextures,
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      // Check that arena was created successfully
      expect(arena).toBeDefined();
    });

    it("should log the number of pre-loaded textures", async () => {
      const consoleSpy = vi.spyOn(console, "log");

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: mockTextures,
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("3 pre-loaded textures"));
    });

    it("should handle empty texture map", async () => {
      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: {},
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(arena).toBeDefined();
    });
  });

  describe("URL Loading (Legacy)", () => {
    it("should handle single spritesheet URL", async () => {
      const loadSpy = vi.spyOn(Assets, "load").mockResolvedValue({
        textures: mockTextures,
      } as any);

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: "./test-atlas.json",
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(loadSpy).toHaveBeenCalledWith("./test-atlas.json");
      loadSpy.mockRestore();
    });

    it("should handle multiple spritesheet URLs", async () => {
      const loadSpy = vi
        .spyOn(Assets, "load")
        .mockResolvedValueOnce({ textures: { tex1: {} } } as any)
        .mockResolvedValueOnce({ textures: { tex2: {} } } as any);

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: ["./atlas1.json", "./atlas2.json"],
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(loadSpy).toHaveBeenCalledTimes(2);
      loadSpy.mockRestore();
    });

    it("should handle loading errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      const loadSpy = vi.spyOn(Assets, "load").mockRejectedValue(new Error("Network error"));

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: "./non-existent.json",
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Could not load tile textures"),
        expect.any(Error)
      );

      loadSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Deprecated APIs", () => {
    it("should still support tileSpritesheet (deprecated)", async () => {
      const loadSpy = vi.spyOn(Assets, "load").mockResolvedValue({
        textures: mockTextures,
      } as any);

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileSpritesheet: "./old-api.json",
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(loadSpy).toHaveBeenCalled();
      loadSpy.mockRestore();
    });

    it("should still support tileSpritesheets (deprecated)", async () => {
      const loadSpy = vi
        .spyOn(Assets, "load")
        .mockResolvedValueOnce({ textures: { tex1: {} } } as any)
        .mockResolvedValueOnce({ textures: { tex2: {} } } as any);

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileSpritesheets: ["./old1.json", "./old2.json"],
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(loadSpy).toHaveBeenCalledTimes(2);
      loadSpy.mockRestore();
    });

    it("should prioritize tileTextures over deprecated APIs", async () => {
      const loadSpy = vi.spyOn(Assets, "load");

      const config: ArenaConfig = {
        radius: 2,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: mockTextures,
        tileSpritesheet: "./should-be-ignored.json",
        tileSpritesheets: ["./also-ignored.json"],
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      // Assets.load should NOT be called when pre-loaded textures are provided
      expect(loadSpy).not.toHaveBeenCalled();
      loadSpy.mockRestore();
    });
  });

  describe("Texture Rendering", () => {
    it("should use terrain map to select specific textures", async () => {
      const config: ArenaConfig = {
        radius: 1,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: mockTextures,
        terrainMap: {
          "0,0": {
            type: "forest",
            spriteId: "hexForest00.png",
            properties: { passable: true },
          },
        },
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      const terrain = arena.getTerrainAt({ q: 0, r: 0 });
      expect(terrain).toBeDefined();
      expect(terrain?.spriteId).toBe("hexForest00.png");
    });

    it("should handle missing texture gracefully", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");

      const config: ArenaConfig = {
        radius: 1,
        tileSize: 32,
        backgroundColor: 0x1099bb,
        tileTextures: mockTextures,
        terrainMap: {
          "0,0": {
            type: "water",
            spriteId: "nonExistentTexture.png",
            properties: { passable: false },
          },
        },
      };

      const arena = new BattleArena(app, config);
      await arena.initialize();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Texture not found for terrain sprite: nonExistentTexture.png")
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
