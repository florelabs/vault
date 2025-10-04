/**
 * BattleBlocks Web Component
 *
 * A Blockly-based visual programming interface for creating battle arena logic.
 * Generates AST/JS/TS compatible with combat SDK and battle-viewer.
 */

import * as Blockly from "blockly";
import defaultGrammar from "./default-grammar.json";
import { generateBlocksFromGrammar, generateToolboxFromGrammar, loadGrammar } from "./grammar.js";
import { deserializeFromProgram, serializeToProgram } from "./serializer.js";
import type { BattleProgram, BlockGrammar, ThemeConfig } from "./types.js";

export interface BattleInstruction {
  type: string;
  id: string;
  parameters: Record<string, unknown>;
  children?: BattleInstruction[];
}

export interface CodeChangeEvent extends CustomEvent {
  detail: {
    code: string;
    ast: BattleInstruction[];
    program: BattleProgram;
    workspace: Blockly.Workspace;
  };
}

export class BattleBlocks extends HTMLElement {
  private workspace: Blockly.Workspace | null = null;
  private blocklyDiv: HTMLDivElement | null = null;
  private grammar: BlockGrammar | null = null;
  private currentTheme: ThemeConfig = {};

  static get observedAttributes(): string[] {
    return ["readonly", "theme"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.setupStyles();
    this.setupBlocklyContainer();
  }

  connectedCallback(): void {
    // Load default grammar and initialize
    this.loadGrammar(defaultGrammar as BlockGrammar)
      .then(() => this.initializeBlockly())
      .catch(console.error);
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === "readonly" && this.workspace) {
      this.workspace.options.readOnly = newValue !== null;
    }
  }

  private setupStyles(): void {
    if (!this.shadowRoot) return;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 500px;
        border: 1px solid var(--battle-blocks-border, #ccc);
        border-radius: 4px;
        overflow: hidden;
        background: var(--battle-blocks-background, #ffffff);
        box-shadow: var(--battle-blocks-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      }
      
      .blockly-container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      
      /* Material-like theming support */
      :host([theme="dark"]) {
        --battle-blocks-background: #1e1e1e;
        --battle-blocks-border: #424242;
        --battle-blocks-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      
      :host([theme="light"]) {
        --battle-blocks-background: #ffffff;
        --battle-blocks-border: #e0e0e0;
        --battle-blocks-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  private setupBlocklyContainer(): void {
    if (!this.shadowRoot) return;

    this.blocklyDiv = document.createElement("div");
    this.blocklyDiv.className = "blockly-container";
    this.blocklyDiv.id = "blockly-div";
    this.shadowRoot.appendChild(this.blocklyDiv);
  }

  private initializeBlockly(): void {
    if (!this.blocklyDiv || !this.grammar) return;

    // Generate blocks from grammar
    generateBlocksFromGrammar(this.grammar);

    // Initialize workspace
    this.workspace = Blockly.inject(this.blocklyDiv, {
      toolbox: generateToolboxFromGrammar(this.grammar),
      scrollbars: true,
      horizontalLayout: false,
      toolboxPosition: "start",
      theme: Blockly.Themes.Classic,
      sounds: false,
      readOnly: this.hasAttribute("readonly"),
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: "#ccc",
        snap: true,
      },
    });

    // Listen for workspace changes
    this.workspace.addChangeListener(() => {
      this.onWorkspaceChange();
    });
  }

  private onWorkspaceChange(): void {
    if (!this.workspace) return;

    // Generate code
    const code = this.generateCode();
    const ast = this.generateAST();
    const program = serializeToProgram(this.workspace);

    // Dispatch custom event
    const event: CodeChangeEvent = new CustomEvent("codechange", {
      detail: { code, ast, program, workspace: this.workspace },
      bubbles: true,
      cancelable: false,
    }) as CodeChangeEvent;

    this.dispatchEvent(event);
  }

  private generateCode(): string {
    if (!this.workspace) {
      return `// Generated battle code
const battleInstructions = [];`;
    }

    // TODO: Implement proper code generation
    // This is a placeholder that generates basic JavaScript
    return `// Generated battle code
const battleInstructions = ${JSON.stringify(this.generateAST(), null, 2)};`;
  }

  private generateAST(): BattleInstruction[] {
    if (!this.workspace) return [];

    const topBlocks = this.workspace.getTopBlocks(true);
    return topBlocks
      .map((block) => this.blockToInstruction(block))
      .filter(Boolean) as BattleInstruction[];
  }

  private blockToInstruction(block: Blockly.Block): BattleInstruction | null {
    // TODO: Implement proper block to instruction conversion
    // This is a placeholder implementation
    return {
      type: block.type,
      id: block.id,
      parameters: {},
      children: [],
    };
  }

  private cleanup(): void {
    if (this.workspace) {
      this.workspace.dispose();
      this.workspace = null;
    }
  }

  /**
   * Get the current workspace
   */
  getWorkspace(): Blockly.Workspace | null {
    return this.workspace;
  }

  /**
   * Load grammar from URL or object
   */
  async loadGrammar(source: string | BlockGrammar): Promise<void> {
    this.grammar = await loadGrammar(source);

    // If workspace already exists, reinitialize with new grammar
    if (this.workspace && this.blocklyDiv) {
      this.cleanup();
      this.initializeBlockly();
    }
  }

  /**
   * Get current grammar
   */
  getGrammar(): BlockGrammar | null {
    return this.grammar;
  }

  /**
   * Load XML into the workspace
   */
  loadXML(xml: string): void {
    if (!this.workspace) return;

    try {
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, this.workspace);
    } catch (error) {
      console.error("Failed to load XML:", error);
    }
  }

  /**
   * Get workspace XML
   */
  getXML(): string {
    if (!this.workspace) return "";

    const dom = Blockly.Xml.workspaceToDom(this.workspace);
    return Blockly.utils.xml.domToText(dom);
  }

  /**
   * Load program from JSON
   */
  loadProgram(program: BattleProgram): void {
    const xml = deserializeFromProgram(program);
    this.loadXML(xml);
  }

  /**
   * Get program as JSON
   */
  getProgram(): BattleProgram {
    if (!this.workspace) {
      return { variables: [], routines: [] };
    }
    return serializeToProgram(this.workspace);
  }

  /**
   * Get generated code
   */
  getCode(): string {
    return this.generateCode();
  }

  /**
   * Get AST representation
   */
  getAST(): BattleInstruction[] {
    return this.generateAST();
  }

  /**
   * Set theme configuration
   */
  setTheme(theme: ThemeConfig): void {
    this.currentTheme = theme;
    this.applyTheme();
  }

  /**
   * Get current theme
   */
  getTheme(): ThemeConfig {
    return { ...this.currentTheme };
  }

  /**
   * Apply theme to component
   */
  private applyTheme(): void {
    if (!this.shadowRoot) return;

    const host = this.shadowRoot.host as HTMLElement;

    // Apply CSS custom properties
    if (this.currentTheme.primary) {
      host.style.setProperty("--battle-blocks-primary", this.currentTheme.primary);
    }
    if (this.currentTheme.secondary) {
      host.style.setProperty("--battle-blocks-secondary", this.currentTheme.secondary);
    }
    if (this.currentTheme.background) {
      host.style.setProperty("--battle-blocks-background", this.currentTheme.background);
    }
    if (this.currentTheme.border) {
      host.style.setProperty("--battle-blocks-border", this.currentTheme.border);
    }
    if (this.currentTheme.shadow) {
      host.style.setProperty("--battle-blocks-shadow", this.currentTheme.shadow);
    }
  }
}

// Register the custom element
if (!customElements.get("battle-blocks")) {
  customElements.define("battle-blocks", BattleBlocks);
}
