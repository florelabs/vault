/**
 * Grammar loader and block generator utilities
 */

import * as Blockly from "blockly";
import type { BlockGrammar, GrammarBlock } from "./types.js";

/**
 * Generate Blockly block definitions from grammar
 */
export function generateBlocksFromGrammar(grammar: BlockGrammar): void {
  if (!grammar.blocks) {
    console.warn("No blocks defined in grammar");
    return;
  }

  for (const blockDef of grammar.blocks) {
    createBlockFromDefinition(blockDef);
  }
}

/**
 * Create a Blockly block from a grammar block definition
 */
function createBlockFromDefinition(blockDef: GrammarBlock): void {
  const blockType = blockDef.type;

  Blockly.Blocks[blockType] = {
    init: function () {
      // Add block title
      this.appendDummyInput().appendField(blockDef.displayName);

      // Add arguments as inputs
      for (const arg of blockDef.args) {
        if (arg.type === "any" || arg.type === "object") {
          // Value input for complex types
          this.appendValueInput(arg.name.toUpperCase()).setCheck(null).appendField(arg.name);
        } else if (arg.type === "string") {
          // Text input for strings
          this.appendValueInput(arg.name.toUpperCase())
            .setCheck(["String", null])
            .appendField(arg.name);
        } else if (arg.type === "number") {
          // Number input
          this.appendValueInput(arg.name.toUpperCase())
            .setCheck(["Number", null])
            .appendField(arg.name);
        } else if (arg.type === "boolean") {
          // Boolean input
          this.appendValueInput(arg.name.toUpperCase())
            .setCheck(["Boolean", null])
            .appendField(arg.name);
        } else {
          // Default to value input
          this.appendValueInput(arg.name.toUpperCase()).setCheck(null).appendField(arg.name);
        }
      }

      // Determine if block returns a value or is a statement
      const isExpression =
        blockDef.type.startsWith("get_") ||
        (blockDef.args.length === 0 && blockDef.category === "Query");

      if (isExpression) {
        // Expression blocks return values
        this.setOutput(true, null);
      } else {
        // Statement blocks
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
      }

      // Set appearance
      this.setColour(blockDef.colour || 230);

      if (blockDef.description) {
        this.setTooltip(blockDef.description);
      }

      this.setHelpUrl("");
    },
  };
}

/**
 * Generate toolbox XML from grammar
 */
export function generateToolboxFromGrammar(grammar: BlockGrammar): string {
  const categories: Record<string, GrammarBlock[]> = {};

  // Group blocks by category
  for (const block of grammar.blocks) {
    const category = block.category || "General";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(block);
  }

  // Generate XML
  let xml = '<xml xmlns="https://developers.google.com/blockly/xml">\n';

  // Add custom categories
  for (const [categoryName, blocks] of Object.entries(categories)) {
    const colour = blocks[0]?.colour || 230;
    xml += `  <category name="${categoryName}" colour="${colour}">\n`;
    for (const block of blocks) {
      xml += `    <block type="${block.type}"></block>\n`;
    }
    xml += "  </category>\n";
  }

  // Add standard Blockly blocks
  xml += '  <category name="Values" colour="290">\n';
  xml += '    <block type="text"></block>\n';
  xml += '    <block type="math_number"></block>\n';
  xml += '    <block type="logic_boolean"></block>\n';
  xml += "  </category>\n";

  xml += '  <category name="Logic" colour="210">\n';
  xml += '    <block type="controls_if"></block>\n';
  xml += '    <block type="logic_compare"></block>\n';
  xml += '    <block type="logic_operation"></block>\n';
  xml += "  </category>\n";

  xml += '  <category name="Loops" colour="120">\n';
  xml += '    <block type="controls_repeat_ext"></block>\n';
  xml += '    <block type="controls_whileUntil"></block>\n';
  xml += "  </category>\n";

  xml += "</xml>";
  return xml;
}

/**
 * Load grammar from JSON
 */
export async function loadGrammar(source: string | BlockGrammar): Promise<BlockGrammar> {
  if (typeof source === "string") {
    // Load from URL
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to load grammar from ${source}: ${response.statusText}`);
    }
    return response.json();
  }

  // Grammar object provided directly
  return source;
}
