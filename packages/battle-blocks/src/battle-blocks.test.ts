/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BattleBlocks } from "./battle-blocks.js";

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
});
