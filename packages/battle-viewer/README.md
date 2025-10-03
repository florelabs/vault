# @florelabs/battle-viewer

Auto-battle visualizer using PixiJS, packaged as a Web Component with hexagonal grid support.

## Features

- 🎮 Real-time battle visualization with hexagonal grid
- 🎨 PixiJS-powered graphics and animations  
- 📦 Web Component (framework agnostic)
- 🔒 Isolated shadowDOM
- 📱 Responsive design
- ⚡ High performance rendering
- 🗺️ Hexagonal coordinate system (axial coordinates)
- 🎭 Character animations and movement
- ↔️ Automatic character facing direction based on actions
- ⚔️ Battle orchestration with turn-based actions

## Installation

```bash
npm install @florelabs/battle-viewer
```

## Usage

### Basic Example

```javascript
import "@florelabs/battle-viewer";

const battleData = {
  participants: [
    {
      id: "hero",
      name: "Knight", 
      initialPosition: { q: 1, r: 1 }, // Hexagonal coordinates
      spriteConfig: {
        spritesheet: "/sprites/knight.json",
        size: { width: 64, height: 64 },
        anchor: { x: 0.5, y: 0.85 }
      },
      weaponId: 1
    },
    {
      id: "enemy", 
      name: "Orc",
      initialPosition: { q: -2, r: 1 },
      spriteConfig: {
        spritesheet: "/sprites/orc.json", 
        size: { width: 64, height: 64 }
      }
    }
  ],
  turns: [
    {
      id: "turn-1",
      timestamp: Date.now(),
      actions: [
        {
          type: "move",
          actor: "hero", 
          path: [
            { q: 1, r: 1 },
            { q: 0, r: 1 },
            { q: -1, r: 1 }
          ]
        }
      ]
    },
    {
      id: "turn-2",
      timestamp: Date.now() + 2000,
      actions: [
        {
          type: "attack",
          actor: "hero",
          target: "enemy",
          position: { q: -2, r: 1 }
        }
      ]
    }
  ]
};

// Set data via attribute
document.querySelector("battle-viewer").setAttribute("data", JSON.stringify(battleData));

// Or set data via method
document.querySelector("battle-viewer").setBattleData(battleData);
```

### Advanced Configuration

```javascript
const viewer = document.querySelector("battle-viewer");

// Configure arena
viewer.setArenaConfig({
  radius: 6,           // Hex grid radius
  tileSize: 40,        // Size of each hex tile
  backgroundColor: 0x2c5aa0,  // Background color
  tileSpritesheet: "/sprites/hex_tiles.json"  // Optional tile sprites
});

// Control playback
viewer.setPlaying(true);   // Start battle
viewer.setPlaying(false);  // Pause battle  
viewer.reset();           // Reset to beginning
```

## API Reference

### Properties

- `setBattleData(data: BattleData): void` - Set battle data
- `getBattleData(): BattleData | null` - Get current battle data
- `setArenaConfig(config: Partial<ArenaConfig>): void` - Configure arena settings
- `getArenaConfig(): ArenaConfig` - Get current arena configuration
- `setPlaying(playing: boolean): void` - Control battle playback
- `reset(): void` - Reset battle to start
- `getArena(): BattleArena | null` - Get arena instance for advanced usage

### Attributes

- `data` - JSON string containing battle data
- `config` - JSON string containing arena configuration

## Data Types

### Core Battle Types

```typescript
interface BattleData {
  participants: BattleParticipant[];
  turns: BattleTurn[];
}

interface BattleParticipant {
  id: string;
  name: string;
  initialPosition: AxialCoordinates;  // Hexagonal coordinates
  spriteConfig?: SpriteConfig;
  weaponId?: number | null;
}

interface BattleTurn {
  id: string;
  timestamp: number;
  actions: BattleAction[];
}

interface BattleAction {
  type: "move" | "attack" | "skill" | "effect";
  actor: string;
  target?: string;
  position?: AxialCoordinates;
  path?: AxialCoordinates[];      // For multi-step movement
  data?: Record<string, unknown>; // Additional action data
}
```

### Configuration Types

```typescript
interface ArenaConfig {
  radius: number;                 // Hex grid radius (5 = 91 tiles)
  tileSize: number;              // Size of each hex tile in pixels  
  backgroundColor: number;        // Hex color value
  viewportWidth?: number;        // Override viewport width
  viewportHeight?: number;       // Override viewport height  
  tileSpritesheet?: string;      // Optional tile texture atlas
}

interface SpriteConfig {
  spritesheet: string;           // Path to sprite atlas
  animations?: AnimationConfig;   // Animation settings
  size?: { width: number; height: number };
  anchor?: { x: number; y: number };
  facingConfig?: CharacterFacingConfig;  // Facing direction settings
}

interface CharacterFacingConfig {
  defaultFacing?: "left" | "right";    // Default facing direction (default: "right")
  allowMirroring?: boolean;            // Enable sprite mirroring (default: true)
}

interface AxialCoordinates {
  q: number;  // Axial coordinate Q
  r: number;  // Axial coordinate R
}
```

## Character Facing Direction

The battle viewer automatically manages character facing directions based on their actions:

### Automatic Facing Direction

Characters will automatically face the correct direction when:
- **At spawn**: Face towards the center (0,0) by default
- **Moving**: Face towards the destination (left for decreasing q, right for increasing q)
- **Attacking**: Face towards the target character
- **Using Skills**: Face towards the target (if applicable)

### Configuration

```javascript
const participant = {
  id: "hero",
  name: "Knight",
  initialPosition: { q: -2, r: 1 }, // Will face right (towards center)
  spriteConfig: {
    spritesheet: "/sprites/knight.json",
    size: { width: 64, height: 64 },
    facingConfig: {
      defaultFacing: "right",     // Override auto-center facing if needed
      allowMirroring: true        // Enable horizontal sprite flipping
    }
  }
};
```

### Manual Control

You can also manually control facing direction:

```javascript
const arena = viewer.getArena();
const character = arena.getCharacter("hero");

// Set facing direction
character.setFacingDirection("left");

// Get current facing direction
const currentFacing = character.getFacingDirection(); // "left" | "right"

// Get character's axial position
const axialPos = character.getAxialPosition(); // { q: number, r: number }

// Move using axial coordinates (handles facing automatically)
await character.moveToAxialPosition({ q: 1, r: 0 });
```

### Coordinate System Behavior

- **q increasing** (moving right): Character faces right
- **q decreasing** (moving left): Character faces left  
- **q unchanged**: No facing change (maintains current direction)

Example with hexagonal movement:
```
   (-1,0) ← faces left ← (0,0) → faces right → (1,0)
```
```

## Hexagonal Coordinate System

This library uses **axial coordinates** for the hexagonal grid:

- `q` axis points to the right
- `r` axis points down and to the left
- `s = -q - r` (derived third coordinate)

```
     (-1,-1) ( 0,-1) ( 1,-1)
(-1, 0) ( 0, 0) ( 1, 0) ( 2, 0)  
     (-1, 1) ( 0, 1) ( 1, 1)
```

### Coordinate Utilities

```javascript
import { generateAxialCoordinates, axialToPixel } from "@florelabs/battle-viewer";

// Generate all coordinates within radius 3
const coords = generateAxialCoordinates(3);

// Convert axial to pixel coordinates  
const pixel = axialToPixel({ q: 1, r: -1 }, 32 /* tileSize */);
```

## Advanced Usage

### Custom Arena Integration

```javascript
import { BattleArena, BattleOrchestrator } from "@florelabs/battle-viewer";

// Access the low-level arena API
const viewer = document.querySelector("battle-viewer");
const arena = viewer.getArena();

// Add custom character
await arena.addCharacter({
  id: "custom",
  name: "Custom Character",
  initialPosition: { q: 0, r: 0 },
  spriteConfig: { 
    spritesheet: "/my-custom-sprite.json"
  }
});

// Get character for direct manipulation
const character = arena.getCharacter("custom");
await character.moveToPosition({ x: 100, y: 100 });
```

## Examples

See the `examples/` directory for:
- `basic-usage.html` - Simple battle setup
- `hexagonal-battle.html` - Advanced hexagonal combat with controls
- `facing-direction-demo.html` - Character facing direction demonstration
- `center-facing-demo.html` - Characters facing towards center demonstration

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

Requires support for:
- Web Components (Custom Elements v1)
- ES2022 features
- WebGL (for PixiJS)

## Performance Notes

- The hexagonal grid scales well up to radius 10 (331 tiles)
- Character sprites are cached after first load
- Battle orchestration runs at 60 FPS with smooth animations
- Memory usage is optimized with texture atlases

## License

MIT © Thomas Florelli