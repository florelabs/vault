/**
 * Serialization utilities for converting Blockly workspace to JSON program format
 */

import type * as Blockly from "blockly";
import type { BattleProgram, ProgramInstruction, ProgramRoutine } from "./types.js";

/**
 * Serialize workspace to battle program JSON format
 */
export function serializeToProgram(workspace: Blockly.Workspace): BattleProgram {
  const topBlocks = workspace.getTopBlocks(true);
  const instructions: ProgramInstruction[] = [];

  for (const block of topBlocks) {
    const instruction = blockToInstruction(block);
    if (instruction) {
      instructions.push(instruction);
    }
  }

  // For now, wrap all instructions in a main routine
  // In the future, this could be more sophisticated with actual routine detection
  const mainRoutine: ProgramRoutine = {
    name: "main",
    args: [],
    body: instructions,
  };

  return {
    variables: [],
    routines: [mainRoutine],
  };
}

/**
 * Convert a Blockly block to a program instruction
 */
function blockToInstruction(block: Blockly.Block): ProgramInstruction | null {
  if (!block || (block as unknown as { disabled?: boolean }).disabled) {
    return null;
  }

  const instruction: ProgramInstruction = {
    type: block.type,
  };

  // Get all input fields and values
  const inputList = block.inputList;

  for (const input of inputList) {
    // Handle field inputs (like text fields, dropdowns)
    for (const field of input.fieldRow) {
      if (field.name && field.name !== "") {
        const fieldName = field.name.toLowerCase();
        instruction[fieldName] = field.getValue();
      }
    }

    // Handle value inputs (connected blocks)
    if (input.connection?.targetBlock()) {
      const targetBlock = input.connection.targetBlock();
      if (targetBlock) {
        const inputName = input.name.toLowerCase();
        instruction[inputName] = getValueFromBlock(targetBlock);
      }
    }
  }

  // Handle next block (sequential statements)
  const nextBlock = block.getNextBlock();
  if (nextBlock) {
    // Continue building the instruction list
    // The parent will handle this
  }

  return instruction;
}

/**
 * Get the value from a value block
 */
function getValueFromBlock(block: Blockly.Block): unknown {
  const blockType = block.type;

  // Handle standard Blockly blocks
  if (blockType === "text") {
    return block.getFieldValue("TEXT");
  }

  if (blockType === "math_number") {
    return Number(block.getFieldValue("NUM"));
  }

  if (blockType === "logic_boolean") {
    return block.getFieldValue("BOOL") === "TRUE";
  }

  // Handle custom blocks - check if it's a query/getter type
  if (blockType.startsWith("get_")) {
    const args: Record<string, unknown> = {};

    // Get all inputs for the call
    const inputList = block.inputList;
    for (const input of inputList) {
      for (const field of input.fieldRow) {
        if (field.name && field.name !== "") {
          const fieldName = field.name.toLowerCase();
          args[fieldName] = field.getValue();
        }
      }

      if (input.connection?.targetBlock()) {
        const targetBlock = input.connection.targetBlock();
        if (targetBlock) {
          const inputName = input.name.toLowerCase();
          args[inputName] = getValueFromBlock(targetBlock);
        }
      }
    }

    return { call: { name: blockType, args } };
  }

  // For other blocks, return as object with type and fields
  const value: Record<string, unknown> = {
    type: blockType,
  };

  const inputList = block.inputList;
  for (const input of inputList) {
    for (const field of input.fieldRow) {
      if (field.name && field.name !== "") {
        const fieldName = field.name.toLowerCase();
        value[fieldName] = field.getValue();
      }
    }

    if (input.connection?.targetBlock()) {
      const targetBlock = input.connection.targetBlock();
      if (targetBlock) {
        const inputName = input.name.toLowerCase();
        value[inputName] = getValueFromBlock(targetBlock);
      }
    }
  }

  return value;
}

/**
 * Deserialize a battle program JSON to workspace XML
 */
export function deserializeFromProgram(program: BattleProgram): string {
  let xml = '<xml xmlns="https://developers.google.com/blockly/xml">\n';

  let yPos = 50;

  // Process routines
  for (const routine of program.routines) {
    for (let i = 0; i < routine.body.length; i++) {
      const instruction = routine.body[i];
      xml += generateBlockXML(instruction, 50, yPos);
      yPos += 100;
    }
  }

  xml += "</xml>";
  return xml;
}

/**
 * Generate XML for a single instruction
 */
function generateBlockXML(instruction: ProgramInstruction, x: number, y: number): string {
  const blockId = `block_${Math.random().toString(36).substr(2, 9)}`;
  let xml = `  <block type="${instruction.type}" id="${blockId}" x="${x}" y="${y}">\n`;

  // Add fields and values
  for (const [key, value] of Object.entries(instruction)) {
    if (key === "type") continue;

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      xml += `    <field name="${key.toUpperCase()}">${value}</field>\n`;
    } else if (typeof value === "object" && value !== null) {
      // Handle complex values
      xml += generateValueXML(key, value);
    }
  }

  xml += "  </block>\n";
  return xml;
}

/**
 * Generate XML for a value block
 */
function generateValueXML(inputName: string, value: unknown): string {
  if (typeof value === "object" && value !== null) {
    if ("var" in value) {
      // Variable reference - not fully supported in base Blockly, but we can use text
      return `    <value name="${inputName.toUpperCase()}">
      <block type="text">
        <field name="TEXT">${value.var}</field>
      </block>
    </value>\n`;
    }

    if ("call" in value) {
      const call = value.call as { name: string; args: Record<string, unknown> };
      // Method call - create a block for it
      let xml = `    <value name="${inputName.toUpperCase()}">
      <block type="${call.name}">\n`;

      const args = call.args as Record<string, unknown>;
      for (const [argName, argValue] of Object.entries(args)) {
        if (typeof argValue === "string" || typeof argValue === "number") {
          xml += `        <value name="${argName.toUpperCase()}">
          <block type="${typeof argValue === "number" ? "math_number" : "text"}">
            <field name="${typeof argValue === "number" ? "NUM" : "TEXT"}">${argValue}</field>
          </block>
        </value>\n`;
        }
      }

      xml += "      </block>\n    </value>\n";
      return xml;
    }
  }

  return "";
}
