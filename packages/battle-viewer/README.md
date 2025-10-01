# @florelabs/battle-viewer

Auto-battle visualizer using PixiJS, packaged as a Web Component.

## Features

- 🎮 Real-time battle visualization
- 🎨 PixiJS-powered graphics
- 📦 Web Component (framework agnostic)
- 🔒 Isolated shadowDOM
- 📱 Responsive design
- ⚡ High performance rendering

## Installation

```bash
npm install @florelabs/battle-viewer
```

## Usage

### As ES Module

```javascript
import "@florelabs/battle-viewer";

// Use in your HTML
const battleData = {
  turns: [
    {
      id: "turn-1",
      timestamp: Date.now(),
      actions: [
        {
          type: "move",
          actor: "player1",
          position: { x: 100, y: 200 }
        }
      ]
    }
  ],
  participants: [
    {
      id: "player1",
      name: "Hero",
      initialPosition: { x: 50, y: 100 }
    }
  ]
};

document.querySelector("battle-viewer").setAttribute("data", JSON.stringify(battleData));
```

### In HTML

```html
<script type="module">
  import "@florelabs/battle-viewer";
</script>

<battle-viewer id="viewer"></battle-viewer>

<script>
  const viewer = document.getElementById("viewer");
  viewer.setBattleData({
    turns: [],
    participants: []
  });
</script>
```

## API

### Attributes

- `data`: JSON string containing battle data

### Properties

- `setBattleData(data: BattleData): void` - Set battle data programmatically
- `getBattleData(): BattleData | null` - Get current battle data

### Events

Currently no custom events are emitted, but this may change in future versions.

## Data Format

```typescript
interface BattleData {
  turns: BattleTurn[];
  participants: BattleParticipant[];
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
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

interface BattleParticipant {
  id: string;
  name: string;
  initialPosition: { x: number; y: number };
  sprite?: string;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT © Thomas Florelli