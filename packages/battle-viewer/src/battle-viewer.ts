/**
 * BattleViewer Web Component
 *
 * A web component that renders auto-battle timeline using PixiJS.
 * Displays positions, actions, and effects in an isolated shadowRoot.
 */

import { Application } from "pixi.js";

export interface BattleTurn {
  id: string;
  timestamp: number;
  actions: BattleAction[];
}

export interface BattleAction {
  type: "move" | "attack" | "skill" | "effect";
  actor: string;
  target?: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

export interface BattleData {
  turns: BattleTurn[];
  participants: BattleParticipant[];
}

export interface BattleParticipant {
  id: string;
  name: string;
  initialPosition: { x: number; y: number };
  sprite?: string;
}

export class BattleViewer extends HTMLElement {
  private app: Application | null = null;
  private battleData: BattleData | null = null;

  static get observedAttributes(): string[] {
    return ["data"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "closed" });
    this.setupStyles();
    this.setupCanvas();
  }

  connectedCallback(): void {
    this.initializePixiApp();
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
  }

  private setupStyles(): void {
    if (!this.shadowRoot) return;

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
    this.shadowRoot.appendChild(style);
  }

  private setupCanvas(): void {
    if (!this.shadowRoot) return;

    const canvas = document.createElement("canvas");
    canvas.id = "battle-canvas";
    this.shadowRoot.appendChild(canvas);
  }

  private async initializePixiApp(): Promise<void> {
    if (!this.shadowRoot) return;

    const canvas = this.shadowRoot.getElementById("battle-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    try {
      this.app = new Application();
      await this.app.init({
        canvas,
        width: this.clientWidth || 800,
        height: this.clientHeight || 400,
        backgroundColor: 0x1099bb,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      // Initial render if data is already available
      if (this.battleData) {
        this.renderBattle();
      }
    } catch (error) {
      console.error("Failed to initialize PixiJS application:", error);
    }
  }

  private renderBattle(): void {
    if (!this.app || !this.battleData) return;

    // Clear existing content
    this.app.stage.removeChildren();

    // TODO: Implement actual battle rendering
    // This is a placeholder implementation
    console.log("Rendering battle with data:", this.battleData);
  }

  private cleanup(): void {
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
}

// Register the custom element
if (!customElements.get("battle-viewer")) {
  customElements.define("battle-viewer", BattleViewer);
}
