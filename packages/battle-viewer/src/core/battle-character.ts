import {
  AnimatedSprite,
  Assets,
  Container,
  Graphics,
  type Spritesheet,
  type Texture,
} from "pixi.js";
import type { AnimationName, PixelCoordinates, SpriteConfig } from "../types/index.js";

// moved to types

interface Animation {
  name: AnimationName;
  speed: number;
  loop: boolean;
  onComplete?: () => void;
}

const DEFAULT_ANIMATIONS: Record<AnimationName, Omit<Animation, "name" | "onComplete">> = {
  idle: { speed: 0.15, loop: true },
  run: { speed: 0.25, loop: true },
  attack: { speed: 0.2, loop: false },
  hit: { speed: 0.3, loop: false },
};

export class BattleCharacter {
  private id: string;
  private spriteConfig: SpriteConfig;
  private container: Container;
  private animatedSprite: AnimatedSprite | null = null;
  private fallbackSprite: Graphics | null = null;
  private spritesheet: Spritesheet | null = null;
  private currentAnimation: AnimationName = "idle";
  private position: PixelCoordinates;
  private weaponId: number | null;

  constructor(
    id: string,
    initialPosition: PixelCoordinates,
    spriteConfig: SpriteConfig = { spritesheet: "" },
    _weaponId: number | null = null
  ) {
    this.id = id;
    this.spriteConfig = {
      size: { width: 64, height: 64 },
      anchor: { x: 0.5, y: 0.85 },
      ...spriteConfig,
    };
    this.position = { ...initialPosition };
    this.weaponId = _weaponId;

    this.container = new Container();
    this.container.x = this.position.x;
    this.container.y = this.position.y;

    // TODO: Use weaponId for weapon rendering/logic
    if (this.weaponId !== null) {
      console.debug(`Character ${id} initialized with weapon ${this.weaponId}`);
    }
  }

  async initialize(): Promise<void> {
    if (this.spriteConfig.spritesheet) {
      await this.loadSpritesheet();
      this.createAnimatedSprite();
    } else {
      // Create fallback visual representation
      this.createFallbackSprite();
    }
  }

  private createFallbackSprite(): void {
    this.fallbackSprite = new Graphics();

    // Create a simple colored circle to represent the character
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd];
    const color =
      colors[Math.abs(this.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];

    const radius = Math.min(this.spriteConfig.size?.width, this.spriteConfig.size?.height) / 2;

    this.fallbackSprite.circle(0, 0, radius);
    this.fallbackSprite.fill(color);
    this.fallbackSprite.stroke({ width: 2, color: 0xffffff });

    // Add a simple label
    // Note: In a real implementation, you might want to add PIXI.Text here

    this.container.addChild(this.fallbackSprite);
    console.log(
      `Created fallback sprite for character ${this.id} with color ${color.toString(16)}`
    );
  }

  private async loadSpritesheet(): Promise<void> {
    try {
      this.spritesheet = await Assets.load(this.spriteConfig.spritesheet);
      console.log(`[BattleCharacter:${this.id}] Spritesheet loaded`, this.spriteConfig.spritesheet);
    } catch (error) {
      console.error(`Failed to load spritesheet for character ${this.id}:`, error);
    }
  }

  private createAnimatedSprite(): void {
    if (!this.spritesheet) return;

    const animations = this.getAnimationTextures();
    const idleKey = this.spriteConfig.animationMap?.idle;
    const idleTextures = idleKey ? animations[idleKey] : undefined;
    console.log(`[BattleCharacter:${this.id}] Available animations:`, Object.keys(animations));
    console.log(
      `[BattleCharacter:${this.id}] Idle key:`,
      idleKey,
      "frames:",
      idleTextures?.length ?? 0
    );

    if (idleTextures && idleTextures.length > 0) {
      this.animatedSprite = new AnimatedSprite(idleTextures);

      this.animatedSprite.width = this.spriteConfig.size?.width;
      this.animatedSprite.height = this.spriteConfig.size?.height;
      this.animatedSprite.anchor.set(this.spriteConfig.anchor?.x, this.spriteConfig.anchor?.y);

      this.setAnimation("idle");
      this.container.addChild(this.animatedSprite);
      console.log(`[BattleCharacter:${this.id}] Animated sprite created.`);
    } else {
      console.warn(
        `[BattleCharacter:${this.id}] No idle textures found for key`,
        idleKey,
        "Check spriteConfig.animationMap.idle"
      );
      this.createFallbackSprite();
    }
  }

  private getAnimationTextures(): Record<string, Texture[]> {
    if (!this.spritesheet) return {};

    const animations: Record<string, Texture[]> = {};

    // Prefer TexturePacker/Pixi animations if present
    const sheetAnims = (
      this.spritesheet as Spritesheet & { animations?: Record<string, Texture[]> }
    ).animations;
    if (sheetAnims && Object.keys(sheetAnims).length > 0) {
      for (const [key, frames] of Object.entries(sheetAnims)) {
        animations[key] = frames as Texture[];
      }
    } else {
      // Fallback: group by filename prefix and sort by numeric suffix
      const grouped: Record<string, Array<{ name: string; texture: Texture }>> = {};
      for (const [textureName, texture] of Object.entries(this.spritesheet.textures)) {
        const match = textureName.match(/^([^._]+(?:_[A-Za-z]+)?)_?\d*\.png$/);
        if (match) {
          const animKey = match[1];
          if (!grouped[animKey]) grouped[animKey] = [];
          grouped[animKey].push({ name: textureName, texture });
        }
      }

      const numRegex = /(\d+)(?=\.png$)/;
      for (const key of Object.keys(grouped)) {
        grouped[key].sort((a, b) => {
          const an = a.name.match(numRegex);
          const bn = b.name.match(numRegex);
          if (an && bn) return Number(an[0]) - Number(bn[0]);
          return a.name.localeCompare(b.name);
        });
        animations[key] = grouped[key].map((e) => e.texture);
      }
    }

    // Fallback: if no specific animations found, use all textures as idle
    if (Object.keys(animations).length === 0) {
      console.warn(
        `[BattleCharacter:${this.id}] No animations found in spritesheet`,
        this.spriteConfig.spritesheet
      );
      throw new Error(`[BattleCharacter:${this.id}] No animations found in spritesheet`);
    }

    return animations;
  }

  setAnimation(name: AnimationName, onComplete?: () => void): void {
    this.currentAnimation = name;

    if (this.animatedSprite && this.spritesheet) {
      const animations = this.getAnimationTextures();
      // Strictly use mapping from logical name -> atlas key
      const atlasKey = this.spriteConfig.animationMap?.[name];
      const textures = atlasKey ? animations[atlasKey] : undefined;

      if (!atlasKey || !textures || textures.length === 0) {
        console.warn(
          `[BattleCharacter:${this.id}] Missing or empty textures for`,
          name,
          "mapped to",
          atlasKey
        );
        return;
      }

      // Get animation config
      const config = this.spriteConfig.animations?.[name] || DEFAULT_ANIMATIONS[name];

      this.animatedSprite.textures = textures;
      this.animatedSprite.animationSpeed = config.speed;
      this.animatedSprite.loop = config.loop;

      if (!config.loop && onComplete) {
        this.animatedSprite.onComplete = () => {
          onComplete();
          if (this.animatedSprite) {
            this.animatedSprite.onComplete = undefined;
          }
        };
      } else {
        this.animatedSprite.onComplete = undefined;
      }

      this.animatedSprite.gotoAndPlay(0);
    } else if (this.fallbackSprite) {
      // Simple animation for fallback sprite (just call onComplete if needed)
      if (!DEFAULT_ANIMATIONS[name].loop && onComplete) {
        setTimeout(onComplete, 500); // Simulate animation duration
      }
    }
  }

  async moveToPosition(targetPosition: PixelCoordinates, duration = 1000): Promise<void> {
    this.setAnimation("run");

    return new Promise<void>((resolve) => {
      const startPosition = { ...this.position };
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Simple easing
        const eased = 1 - (1 - progress) ** 3;

        this.position.x = startPosition.x + (targetPosition.x - startPosition.x) * eased;
        this.position.y = startPosition.y + (targetPosition.y - startPosition.y) * eased;

        this.container.x = this.position.x;
        this.container.y = this.position.y;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.setAnimation("idle");
          resolve();
        }
      };

      animate();
    });
  }

  async moveAlongPath(path: PixelCoordinates[], stepDuration = 1000): Promise<void> {
    for (const position of path) {
      await this.moveToPosition(position, stepDuration);
    }
  }

  async attack(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.setAnimation("attack", () => {
        this.setAnimation("idle");
        resolve();
      });
    });
  }

  async hit(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.setAnimation("hit", () => {
        this.setAnimation("idle");
        resolve();
      });
    });
  }

  getPosition(): PixelCoordinates {
    return { ...this.position };
  }

  setPosition(position: PixelCoordinates): void {
    this.position = { ...position };
    this.container.x = this.position.x;
    this.container.y = this.position.y;
  }

  getId(): string {
    return this.id;
  }

  getContainer(): Container {
    return this.container;
  }

  getCurrentAnimation(): AnimationName {
    return this.currentAnimation;
  }

  destroy(): void {
    if (this.animatedSprite) {
      this.animatedSprite.destroy();
    }
    if (this.fallbackSprite) {
      this.fallbackSprite.destroy();
    }
    this.container.destroy();
  }
}
