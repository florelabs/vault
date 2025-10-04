# @florelabs/battle-blocks

A Blockly Web Component specialized for generating battle arena instructions with grammar-driven block definitions, JSON program serialization, and material-like theming.

## Features

- 🧩 Visual programming with Blockly
- 📋 **JSON Grammar System** - Define custom blocks via JSON configuration
- ⚔️ Battle-specific block types
- 📦 Web Component (framework agnostic)
- 🔧 Code generation (JS/TS/AST)
- 💾 **JSON Program Serialization** - Export/import programs in structured JSON format
- 🎨 **Material-like Theming** - CSS custom properties with runtime theme switching
- 🔒 Read-only mode support
- ♿ Built on Blockly's accessibility features

## Installation

```bash
npm install @florelabs/battle-blocks
```

## Usage

### Basic Usage

```javascript
import "@florelabs/battle-blocks";

// Listen for code changes
document.querySelector("battle-blocks").addEventListener("codechange", (event) => {
  console.log("Generated code:", event.detail.code);
  console.log("AST:", event.detail.ast);
  console.log("Program:", event.detail.program);
});
```

### Grammar-Driven Block Definitions

Define custom blocks using JSON grammar:

```javascript
const customGrammar = {
  "blocks": [
    {
      "type": "move_toward",
      "displayName": "Move Toward",
      "category": "Actions",
      "colour": 230,
      "args": [
        { "name": "x", "type": "number" },
        { "name": "y", "type": "number" }
      ],
      "description": "Move character toward coordinates"
    },
    {
      "type": "cast",
      "displayName": "Cast Skill",
      "category": "Actions",
      "colour": 230,
      "args": [
        { "name": "skill_id", "type": "string" },
        { "name": "x", "type": "number" },
        { "name": "y", "type": "number" }
      ]
    }
  ]
};

const editor = document.querySelector("battle-blocks");
await editor.loadGrammar(customGrammar);
```

### JSON Program Serialization

Export and import programs in structured JSON format:

```javascript
const editor = document.querySelector("battle-blocks");

// Export program
const program = editor.getProgram();
console.log(JSON.stringify(program, null, 2));
// Output:
// {
//   "variables": [],
//   "routines": [{
//     "name": "main",
//     "args": [],
//     "body": [
//       {
//         "type": "move_toward",
//         "x": 100,
//         "y": 50
//       }
//     ]
//   }]
// }

// Import program
const savedProgram = {
  variables: [],
  routines: [{
    name: "main",
    args: [],
    body: [
      { type: "move_toward", x: 100, y: 50 },
      { type: "cast", skill_id: "basic_attack", x: 100, y: 50 }
    ]
  }]
};
editor.loadProgram(savedProgram);
```

### Theming

Apply custom themes using CSS custom properties:

```javascript
const editor = document.querySelector("battle-blocks");

// Predefined themes via attribute
editor.setAttribute("theme", "dark");

// Custom theme via API
editor.setTheme({
  background: "#1e1e1e",
  border: "#424242",
  shadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
});

// CSS custom properties available:
// --battle-blocks-background
// --battle-blocks-border
// --battle-blocks-shadow
// --battle-blocks-primary
// --battle-blocks-secondary
```

### Complete Example

```html
<script type="module">
  import "@florelabs/battle-blocks";
</script>

<battle-blocks id="editor"></battle-blocks>

<script type="module">
  const editor = document.getElementById("editor");
  
  // Load custom grammar
  await editor.loadGrammar({
    blocks: [
      {
        type: "defend",
        displayName: "Defend Position",
        category: "Actions",
        colour: 120,
        args: [{ name: "duration", type: "number" }]
      }
    ]
  });
  
  // Load existing program
  editor.loadProgram({
    variables: [],
    routines: [{
      name: "main",
      args: [],
      body: [{ type: "defend", duration: 5 }]
    }]
  });
  
  // Listen for changes
  editor.addEventListener("codechange", (e) => {
    const program = e.detail.program;
    console.log("Program updated:", program);
  });
</script>
```

## API

### Attributes

- `readonly`: Makes the editor read-only
- `theme`: Set the theme name (e.g., "dark", "light")

### Properties and Methods

#### Grammar Management

- `loadGrammar(source: string | BlockGrammar): Promise<void>` - Load block definitions from URL or object
- `getGrammar(): BlockGrammar | null` - Get current grammar

#### Workspace Operations

- `getWorkspace(): Blockly.Workspace | null` - Get the Blockly workspace
- `loadXML(xml: string): void` - Load blocks from XML
- `getXML(): string` - Get workspace as XML

#### Program Serialization

- `loadProgram(program: BattleProgram): void` - Load program from JSON format
- `getProgram(): BattleProgram` - Get workspace as structured JSON program

#### Code Generation

- `getCode(): string` - Get generated JavaScript code
- `getAST(): BattleInstruction[]` - Get AST representation

#### Theming

- `setTheme(theme: ThemeConfig): void` - Apply custom theme
- `getTheme(): ThemeConfig` - Get current theme configuration

### Events

- `codechange`: Fired when the workspace changes
  ```typescript
  interface CodeChangeEvent extends CustomEvent {
    detail: {
      code: string;
      ast: BattleInstruction[];
      program: BattleProgram;
      workspace: Blockly.Workspace;
    };
  }
  ```

## Block Types

The default grammar includes:

### Actions

- **Move Toward**: Move character toward coordinates
- **Cast Skill**: Cast a skill at target coordinates
- **Set Variable**: Assign a value to a variable
- **Call Method**: Call a method with arguments

### Query Blocks

- **Get Nearest Enemy**: Returns the ID of the nearest enemy
- **Get Position**: Returns the position of an agent

### Values

- **Text**: String values
- **Number**: Numeric values
- **Boolean**: Boolean values

### Logic & Control

- Standard Blockly logic blocks (if/else, comparisons, etc.)
- Loop blocks (repeat, while, for)

## Grammar Format

Define custom blocks using JSON:

```json
{
  "variables": [
    {
      "name": "enemy_id",
      "type": "string",
      "description": "ID of the nearest enemy"
    }
  ],
  "routines": [
    {
      "name": "main",
      "args": [],
      "description": "Main routine for battle logic"
    }
  ],
  "blocks": [
    {
      "type": "custom_action",
      "displayName": "Custom Action",
      "category": "Actions",
      "colour": 230,
      "args": [
        { "name": "param1", "type": "string" },
        { "name": "param2", "type": "number" }
      ],
      "description": "A custom battle action"
    }
  ]
}
```

## Generated Output

### JSON Program Format

```json
{
  "variables": [],
  "routines": [{
    "name": "main",
    "args": [],
    "body": [
      {
        "type": "set_var",
        "var_name": "enemy_id",
        "value": "enemy1"
      },
      {
        "type": "move_toward",
        "x": 100,
        "y": 50
      }
    ]
  }]
}
```

### AST Format

```typescript
interface BattleInstruction {
  type: string;
  id: string;
  parameters: Record<string, unknown>;
  children?: BattleInstruction[];
}
```

The component also generates JavaScript code from the visual blocks.

## Integration with Battle Viewer

```javascript
import "@florelabs/battle-blocks";
import "@florelabs/battle-viewer";

const blocks = document.querySelector("battle-blocks");
const viewer = document.querySelector("battle-viewer");

blocks.addEventListener("codechange", (event) => {
  // Convert AST to battle data format
  const battleData = convertASTToBattleData(event.detail.ast);
  viewer.setBattleData(battleData);
});
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT © Thomas Florelli
## Examples

See the `examples/` directory for:
- `basic-usage.html` - Simple battle block usage
- `grammar-demo.html` - **Complete demo** showcasing grammar system, theming, and JSON serialization

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type { 
  BlockGrammar, 
  BattleProgram, 
  ThemeConfig,
  GrammarBlock,
  ProgramInstruction
} from "@florelabs/battle-blocks";
```
