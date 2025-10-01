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
    expect(BattleViewer.observedAttributes).toEqual(["data"]);
  });

  it("should handle battle data programmatically", () => {
    const battleData: BattleData = {
      turns: [],
      participants: [],
    };

    element.setBattleData(battleData);
    expect(element.getBattleData()).toEqual(battleData);
  });

  it("should handle battle data via attribute", () => {
    const battleData: BattleData = {
      turns: [
        {
          id: "turn-1",
          timestamp: Date.now(),
          actions: [
            {
              type: "move",
              actor: "player1",
              position: { x: 10, y: 20 },
            },
          ],
        },
      ],
      participants: [
        {
          id: "player1",
          name: "Player 1",
          initialPosition: { x: 0, y: 0 },
        },
      ],
    };

    element.setAttribute("data", JSON.stringify(battleData));
    expect(element.getBattleData()).toEqual(battleData);
  });

  it("should handle invalid JSON gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    element.setAttribute("data", "invalid json");
    expect(element.getBattleData()).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
