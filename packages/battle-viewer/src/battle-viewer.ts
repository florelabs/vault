/**
 * BattleViewer Web Component
 *
 * A web component that renders auto-battle timeline using PixiJS.
 * Displays positions, actions, and effects in an isolated shadowRoot.
 */

import { Application } from "pixi.js";
import { BattleArena } from "./core/battle-arena.js";
import { BattleOrchestrator } from "./core/battle-orchestrator.js";
import type { ArenaConfig, BattleData } from "./types/index.js";

export class BattleViewer extends HTMLElement {
  private app: Application | null = null;
  private battleData: BattleData | null = null;
  private arena: BattleArena | null = null;
  private orchestrator: BattleOrchestrator | null = null;
  private arenaConfig: ArenaConfig = {
    radius: 5,
    tileSize: 32,
    backgroundColor: 0x1099bb,
  };
  private root!: ShadowRoot;

  static get observedAttributes(): string[] {
    return ["data", "config"];
  }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    this.setupStyles();
    this.setupCanvas();
  }

  connectedCallback(): void {
    // Wait for the element to be fully connected and sized
    setTimeout(() => this.initializePixiApp(), 0);
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === "data" && newValue !== oldValue) {
      try {
        this.battleData = JSON.parse(newValue || "null");
        this.renderBattle();
      } catch (error) {
        console.error("Invalid battle data:", error);
      }
    }

    if (name === "config" && newValue !== oldValue) {
      try {
        const config = JSON.parse(newValue || "{}");
        this.arenaConfig = { ...this.arenaConfig, ...config };
        this.reinitializeArena();
      } catch (error) {
        console.error("Invalid arena config:", error);
      }
    }
  }

  private setupStyles(): void {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 400px;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
      }
      
      canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }
    `;
    this.root.appendChild(style);
  }

  private setupCanvas(): void {
    const canvas = document.createElement("canvas");
    canvas.id = "battle-canvas";
    this.root.appendChild(canvas);
  }

  private async initializePixiApp(): Promise<void> {
    const canvas = this.root.getElementById("battle-canvas") as HTMLCanvasElement;
    if (!canvas) {
      console.warn("Canvas element not found");
      return;
    }

    // Get actual dimensions, fallback to defaults
    const rect = this.getBoundingClientRect();
    const width = rect.width > 0 ? Math.floor(rect.width) : 800;
    const height = rect.height > 0 ? Math.floor(rect.height) : 400;

    try {
      this.app = new Application();
      await this.app.init({
        canvas,
        width: Math.floor(width),
        height: Math.floor(height),
        backgroundColor: this.arenaConfig.backgroundColor,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      console.log(`PixiJS initialized: ${width}x${height}`);

      await this.initializeArena();

      // Initial render if data is already available
      if (this.battleData) {
        await this.renderBattle();
      }
    } catch (error) {
      console.error("Failed to initialize PixiJS application:", error);
    }
  }

  private async initializeArena(): Promise<void> {
    if (!this.app) return;

    try {
      this.arena = new BattleArena(this.app, this.arenaConfig);
      await this.arena.initialize();

      this.orchestrator = new BattleOrchestrator(this.arena);
      console.log("Arena initialized successfully");
    } catch (error) {
      console.error("Failed to initialize arena:", error);
    }
  }

  private async reinitializeArena(): Promise<void> {
    if (this.arena) {
      // Update the arena config
      this.arena.updateConfig({
        tileSize: this.arenaConfig.tileSize,
        radius: this.arenaConfig.radius,
        backgroundColor: this.arenaConfig.backgroundColor,
        tileSpritesheet: this.arenaConfig.tileSpritesheet,
        tileTextureName: this.arenaConfig.tileTextureName,
        tileTextureIndex: this.arenaConfig.tileTextureIndex,
      });

      // Reinitialize with the new configuration
      await this.arena.reinitialize();
    } else {
      await this.initializeArena();
    }
  }

  private async renderBattle(): Promise<void> {
    if (!this.app || !this.battleData || !this.arena || !this.orchestrator) return;

    // Clear existing characters (but not tiles since those were handled in reinitializeArena)
    for (const participant of this.battleData.participants) {
      this.arena.removeCharacter(participant.id);
    }

    // Setup participants
    for (const participant of this.battleData.participants) {
      await this.arena.addCharacter(participant);
    }

    // Start orchestration
    this.orchestrator.setBattleData(this.battleData);
  }

  private cleanup(): void {
    if (this.orchestrator) {
      this.orchestrator.destroy();
      this.orchestrator = null;
    }

    if (this.arena) {
      this.arena.destroy();
      this.arena = null;
    }

    if (this.app) {
      this.app.destroy(true, { children: true, texture: true });
      this.app = null;
    }
  }

  /**
   * Set battle data programmatically
   */
  setBattleData(data: BattleData): void {
    this.battleData = data;
    this.renderBattle();
  }

  /**
   * Get current battle data
   */
  getBattleData(): BattleData | null {
    return this.battleData;
  }

  /**
   * Set arena configuration
   */
  setArenaConfig(config: Partial<ArenaConfig>): void {
    this.arenaConfig = { ...this.arenaConfig, ...config };

    // Update the Pixi app background color if it changed
    if (this.app && config.backgroundColor !== undefined) {
      this.app.renderer.background.color = config.backgroundColor;
    }

    this.reinitializeArena();
  }

  /**
   * Get arena configuration
   */
  getArenaConfig(): ArenaConfig {
    return { ...this.arenaConfig };
  }

  /**
   * Play/pause the battle orchestration
   */
  setPlaying(playing: boolean): void {
    if (this.orchestrator) {
      this.orchestrator.setPlaying(playing);
    }
  }

  /**
   * Reset the battle to the beginning
   */
  reset(): void {
    if (this.orchestrator) {
      this.orchestrator.reset();
    }
  }

  /**
   * Get the battle arena instance for advanced usage
   */
  getArena(): BattleArena | null {
    return this.arena;
  }
}

// Register the custom element
if (!customElements.get("battle-viewer")) {
  customElements.define("battle-viewer", BattleViewer);
}
