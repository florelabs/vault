/**
 * BattleBlocks Web Component
 *
 * A Blockly-based visual programming interface for creating battle arena logic.
 * Generates AST/JS/TS compatible with combat SDK and battle-viewer.
 */

import * as Blockly from "blockly";

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
    workspace: Blockly.Workspace;
  };
}

export class BattleBlocks extends HTMLElement {
  private workspace: Blockly.Workspace | null = null;
  private blocklyDiv: HTMLDivElement | null = null;

  static get observedAttributes(): string[] {
    return ["readonly", "theme"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "closed" });
    this.setupStyles();
    this.setupBlocklyContainer();
  }

  connectedCallback(): void {
    this.initializeBlockly();
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
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .blockly-container {
        width: 100%;
        height: 100%;
        position: relative;
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
    if (!this.blocklyDiv) return;

    // Define custom blocks for battle arena
    this.defineCustomBlocks();

    // Initialize workspace
    this.workspace = Blockly.inject(this.blocklyDiv, {
      toolbox: this.createToolbox(),
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

  private defineCustomBlocks(): void {
    // Define battle action block
    Blockly.Blocks.battle_action = {
      init: function () {
        this.appendDummyInput()
          .appendField("Battle Action")
          .appendField(
            new Blockly.FieldDropdown([
              ["Move", "move"],
              ["Attack", "attack"],
              ["Cast Skill", "skill"],
              ["Wait", "wait"],
            ]),
            "ACTION_TYPE"
          );

        this.appendValueInput("TARGET").setCheck("String").appendField("target");

        this.appendStatementInput("PARAMETERS").appendField("with parameters");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Defines a battle action");
        this.setHelpUrl("");
      },
    };

    // Define parameter block
    Blockly.Blocks.battle_parameter = {
      init: function () {
        this.appendDummyInput()
          .appendField("Parameter")
          .appendField(new Blockly.FieldTextInput("name"), "PARAM_NAME")
          .appendField("=");

        this.appendValueInput("VALUE").setCheck(null);

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Sets a parameter for a battle action");
        this.setHelpUrl("");
      },
    };

    // Define position block
    Blockly.Blocks.battle_position = {
      init: function () {
        this.appendDummyInput()
          .appendField("Position (")
          .appendField(new Blockly.FieldNumber(0), "X")
          .appendField(",")
          .appendField(new Blockly.FieldNumber(0), "Y")
          .appendField(")");

        this.setOutput(true, "Position");
        this.setColour(290);
        this.setTooltip("Defines a position on the battle field");
        this.setHelpUrl("");
      },
    };
  }

  private createToolbox(): string {
    return `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <category name="Battle Actions" colour="230">
          <block type="battle_action"></block>
          <block type="battle_parameter"></block>
        </category>
        <category name="Values" colour="290">
          <block type="battle_position"></block>
          <block type="text"></block>
          <block type="math_number"></block>
        </category>
        <category name="Logic" colour="210">
          <block type="controls_if"></block>
          <block type="logic_compare"></block>
          <block type="logic_operation"></block>
          <block type="logic_negate"></block>
          <block type="logic_boolean"></block>
        </category>
        <category name="Loops" colour="120">
          <block type="controls_repeat_ext"></block>
          <block type="controls_whileUntil"></block>
          <block type="controls_for"></block>
        </category>
      </xml>
    `;
  }

  private onWorkspaceChange(): void {
    if (!this.workspace) return;

    // Generate code
    const code = this.generateCode();
    const ast = this.generateAST();

    // Dispatch custom event
    const event: CodeChangeEvent = new CustomEvent("codechange", {
      detail: { code, ast, workspace: this.workspace },
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
}

// Register the custom element
if (!customElements.get("battle-blocks")) {
  customElements.define("battle-blocks", BattleBlocks);
}
