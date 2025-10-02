import type { AxialCoordinates, BattleAction, BattleData } from "../types/index.js";
import { createPixelCoordinatesFactory } from "../utils/hex.js";
import type { BattleArena } from "./battle-arena.js";
import type { BattleCharacter } from "./battle-character.js";

export class BattleOrchestrator {
  private arena: BattleArena;
  private battleData: BattleData | null = null;
  private currentTurnIndex = 0;
  private currentActionIndex = 0;
  private isPlaying = false;
  private isPaused = false;
  private getPixelCoordinates: (coords: AxialCoordinates) => { x: number; y: number };

  constructor(arena: BattleArena) {
    this.arena = arena;
    const config = arena.getConfig();
    this.getPixelCoordinates = createPixelCoordinatesFactory(
      config.tileSize,
      config.viewportWidth ?? 800,
      config.viewportHeight ?? 600
    );
  }

  setBattleData(data: BattleData): void {
    console.log("Setting battle data:", data);
    this.battleData = data;
    this.reset();
  }

  setPlaying(playing: boolean): void {
    if (!this.battleData) return;

    const wasExecuting = this.isExecuting();

    this.isPlaying = playing;
    this.isPaused = !playing;

    if (playing && !wasExecuting) {
      this.executeNextAction();
    }
  }

  reset(): void {
    this.currentTurnIndex = 0;
    this.currentActionIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
  }

  private isExecuting(): boolean {
    return this.currentTurnIndex < (this.battleData?.turns.length || 0) && this.isPlaying;
  }

  private async executeNextAction(): Promise<void> {
    if (!this.battleData || !this.isPlaying || this.isPaused) {
      console.log("Not executing next action: no battle data or not playing or paused");
      return;
    }

    const currentTurn = this.battleData.turns[this.currentTurnIndex];
    if (!currentTurn) {
      console.log("Not executing next action: no current turn");
      return;
    }

    const currentAction = currentTurn.actions[this.currentActionIndex];
    if (!currentAction) {
      console.log("Not executing next action: no current action");
      // Move to next turn
      this.currentTurnIndex++;
      this.currentActionIndex = 0;

      if (this.currentTurnIndex < this.battleData.turns.length) {
        console.log("Executing next action: moving to next turn");
        await this.executeNextAction();
      } else {
        // Battle finished
        this.isPlaying = false;
      }
      return;
    }

    try {
      await this.executeAction(currentAction);

      // Move to next action
      this.currentActionIndex++;

      // Continue if still playing
      if (this.isPlaying && !this.isPaused) {
        // Add a small delay between actions
        setTimeout(() => this.executeNextAction(), 100);
      }
    } catch (error) {
      console.error("Error executing action:", error);
      this.currentActionIndex++; // Skip failed action
      this.executeNextAction();
    }
  }

  private async executeAction(action: BattleAction): Promise<void> {
    const character = this.arena.getCharacter(action.actor);
    if (!character) {
      console.warn(`Character ${action.actor} not found`);
      return;
    }

    switch (action.type) {
      case "move":
        await this.executeMoveAction(character, action);
        break;

      case "attack":
        await this.executeAttackAction(character, action);
        break;

      case "skill":
        await this.executeSkillAction(character, action);
        break;

      case "effect":
        await this.executeEffectAction(character, action);
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async executeMoveAction(character: BattleCharacter, action: BattleAction): Promise<void> {
    if (action.path && action.path.length > 0) {
      // Move along path
      const pixelPath = action.path.map((coord) => this.getPixelCoordinates(coord));
      await character.moveAlongPath(pixelPath);
    } else if (action.position) {
      // Move to single position
      const pixelPosition = this.getPixelCoordinates(action.position);
      await character.moveToPosition(pixelPosition);
    }
  }

  private async executeAttackAction(
    character: BattleCharacter,
    action: BattleAction
  ): Promise<void> {
    // Play attacker animation
    await character.attack();

    // Play hit animation on target if present
    if (action.target) {
      const target = this.arena.getCharacter(action.target);
      if (target && typeof target.hit === "function") {
        await target.hit();
      }
    }
  }

  private async executeSkillAction(
    character: BattleCharacter,
    action: BattleAction
  ): Promise<void> {
    // TODO: Implement skill-specific animations
    // For now, treat as attack
    console.log(`${character.getId()} uses skill:`, action.data);
    await character.attack();
  }

  private async executeEffectAction(
    _character: BattleCharacter,
    action: BattleAction
  ): Promise<void> {
    // TODO: Implement visual effects (particles, screen shake, etc.)
    console.log("Effect action:", action.data);
  }

  getCurrentTurnIndex(): number {
    return this.currentTurnIndex;
  }

  getCurrentActionIndex(): number {
    return this.currentActionIndex;
  }

  getTotalTurns(): number {
    return this.battleData?.turns.length || 0;
  }

  isFinished(): boolean {
    return this.currentTurnIndex >= this.getTotalTurns();
  }

  getProgress(): number {
    if (!this.battleData || this.battleData.turns.length === 0) return 0;

    const totalActions = this.battleData.turns.reduce((sum, turn) => sum + turn.actions.length, 0);

    let completedActions = 0;
    for (let i = 0; i < this.currentTurnIndex; i++) {
      completedActions += this.battleData.turns[i].actions.length;
    }
    completedActions += this.currentActionIndex;

    return Math.min(completedActions / totalActions, 1);
  }

  destroy(): void {
    this.isPlaying = false;
    this.isPaused = true;
    this.battleData = null;
  }
}
