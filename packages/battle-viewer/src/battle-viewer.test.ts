/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type BattleData, BattleViewer } from "./battle-viewer.js";

describe("BattleViewer", () => {
  let element: BattleViewer;

  beforeEach(() => {
    element = new BattleViewer();
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should create a battle viewer element", () => {
    expect(element).toBeInstanceOf(BattleViewer);
  });

  it("should have observed attributes", () => {
    expect(BattleViewer.observedAttributes).toEqual(["data", "config"]);
  });

  it("should handle battle data programmatically", () => {
    const battleData: BattleData = {
      turns: [],
      participants: [],
    };

    element.setBattleData(battleData);
    expect(element.getBattleData()).toEqual(battleData);
  });

  it("should handle hexagonal battle data via attribute", () => {
    const battleData: BattleData = {
      turns: [
        {
          id: "turn-1",
          timestamp: Date.now(),
          actions: [
            {
              type: "move",
              actor: "player1",
              path: [
                { q: 1, r: 1 },
                { q: 0, r: 1 },
              ],
            },
          ],
        },
      ],
      participants: [
        {
          id: "player1",
          name: "Player 1",
          initialPosition: { q: 1, r: 1 },
          spriteConfig: {
            spritesheet: "/test.json",
            size: { width: 64, height: 64 },
          },
        },
      ],
    };

    element.setAttribute("data", JSON.stringify(battleData));
    expect(element.getBattleData()).toEqual(battleData);
  });

  it("should handle arena configuration", () => {
    const config = {
      radius: 6,
      tileSize: 40,
      backgroundColor: 0x123456,
    };

    element.setArenaConfig(config);
    const currentConfig = element.getArenaConfig();

    expect(currentConfig.radius).toBe(6);
    expect(currentConfig.tileSize).toBe(40);
    expect(currentConfig.backgroundColor).toBe(0x123456);
  });

  it("should handle invalid JSON gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    element.setAttribute("data", "invalid json");
    expect(element.getBattleData()).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should control playback", () => {
    // Test basic API - actual functionality would need battle data and arena setup
    expect(() => {
      element.setPlaying(true);
      element.setPlaying(false);
      element.reset();
    }).not.toThrow();
  });
});
