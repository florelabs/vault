/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BattleBlocks } from "./battle-blocks.js";
import type { BattleProgram, BlockGrammar } from "./types.js";

describe("BattleBlocks", () => {
  let element: BattleBlocks;

  beforeEach(() => {
    element = new BattleBlocks();
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should create a battle blocks element", () => {
    expect(element).toBeInstanceOf(BattleBlocks);
  });

  it("should have observed attributes", () => {
    expect(BattleBlocks.observedAttributes).toEqual(["readonly", "theme"]);
  });

  it("should handle readonly attribute", () => {
    element.setAttribute("readonly", "true");
    expect(element.hasAttribute("readonly")).toBe(true);
  });

  it("should generate empty AST initially", () => {
    const ast = element.getAST();
    expect(Array.isArray(ast)).toBe(true);
    expect(ast.length).toBe(0);
  });

  it("should generate empty code initially", () => {
    const code = element.getCode();
    expect(typeof code).toBe("string");
    // The empty workspace should still generate valid code structure
    expect(code).toContain("const battleInstructions");
  });

  it("should handle XML loading", () => {
    const simpleXML = '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
    expect(() => element.loadXML(simpleXML)).not.toThrow();
  });

  it("should get XML representation", () => {
    const xml = element.getXML();
    expect(typeof xml).toBe("string");
  });

  it("should load and get grammar", async () => {
    const customGrammar: BlockGrammar = {
      blocks: [
        {
          type: "test_block",
          displayName: "Test Block",
          args: [],
        },
      ],
    };

    await element.loadGrammar(customGrammar);
    const grammar = element.getGrammar();

    expect(grammar).toBeDefined();
    expect(grammar?.blocks).toHaveLength(1);
    expect(grammar?.blocks[0].type).toBe("test_block");
  });

  it("should get default program format", () => {
    const program = element.getProgram();
    expect(program).toBeDefined();
    expect(program.variables).toEqual([]);
    expect(program.routines).toBeDefined();
    expect(Array.isArray(program.routines)).toBe(true);
  });

  it("should load program from JSON", () => {
    const sampleProgram: BattleProgram = {
      variables: [],
      routines: [
        {
          name: "main",
          args: [],
          body: [
            {
              type: "move_toward",
              x: 100,
              y: 50,
            },
          ],
        },
      ],
    };

    expect(() => element.loadProgram(sampleProgram)).not.toThrow();
  });

  it("should set and get theme", () => {
    const theme = {
      background: "#1e1e1e",
      border: "#424242",
    };

    element.setTheme(theme);
    const currentTheme = element.getTheme();

    expect(currentTheme.background).toBe("#1e1e1e");
    expect(currentTheme.border).toBe("#424242");
  });

  it("should handle theme attribute", () => {
    element.setAttribute("theme", "dark");
    expect(element.getAttribute("theme")).toBe("dark");
  });
});
