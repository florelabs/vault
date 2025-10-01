# @florelabs/battle-blocks

A Blockly Web Component specialized for generating battle arena instructions.

## Features

- 🧩 Visual programming with Blockly
- ⚔️ Battle-specific block types
- 📦 Web Component (framework agnostic)
- 🔧 Code generation (JS/TS/AST)
- 🎨 Customizable themes
- 🔒 Read-only mode support

## Installation

```bash
npm install @florelabs/battle-blocks
```

## Usage

### As ES Module

```javascript
import "@florelabs/battle-blocks";

// Listen for code changes
document.querySelector("battle-blocks").addEventListener("codechange", (event) => {
  console.log("Generated code:", event.detail.code);
  console.log("AST:", event.detail.ast);
});
```

### In HTML

```html
<script type="module">
  import "@florelabs/battle-blocks";
</script>

<battle-blocks id="editor"></battle-blocks>

<script>
  const editor = document.getElementById("editor");
  
  // Load existing program
  editor.loadXML('<xml>...</xml>');
  
  // Get generated code
  const code = editor.getCode();
  const ast = editor.getAST();
</script>
```

## API

### Attributes

- `readonly`: Makes the editor read-only
- `theme`: Set the Blockly theme (optional)

### Properties

- `getWorkspace(): Blockly.Workspace | null` - Get the Blockly workspace
- `loadXML(xml: string): void` - Load blocks from XML
- `getXML(): string` - Get workspace as XML
- `getCode(): string` - Get generated JavaScript code
- `getAST(): BattleInstruction[]` - Get AST representation

### Events

- `codechange`: Fired when the workspace changes
  ```typescript
  interface CodeChangeEvent extends CustomEvent {
    detail: {
      code: string;
      ast: BattleInstruction[];
      workspace: Blockly.Workspace;
    };
  }
  ```

## Block Types

### Battle Actions

- **Battle Action**: Define move, attack, skill, or wait actions
- **Battle Parameter**: Set parameters for actions

### Values

- **Position**: X,Y coordinates on the battle field
- **Text**: String values
- **Number**: Numeric values

### Logic & Control

- Standard Blockly logic blocks (if/else, comparisons, etc.)
- Loop blocks (repeat, while, for)

## Generated Output

The component generates both JavaScript code and an AST that's compatible with `@florelabs/battle-viewer`:

```typescript
interface BattleInstruction {
  type: string;
  id: string;
  parameters: Record<string, unknown>;
  children?: BattleInstruction[];
}
```

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