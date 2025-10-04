/**
 * Type definitions for grammar-driven block system
 */

/**
 * Variable definition in the grammar
 */
export interface GrammarVariable {
  name: string;
  type: string;
  description?: string;
  properties?: Record<string, string>;
}

/**
 * Routine (function) definition in the grammar
 */
export interface GrammarRoutine {
  name: string;
  args: Array<{ name: string; type: string }>;
  description?: string;
}

/**
 * Block argument definition
 */
export interface BlockArgument {
  name: string;
  type: string;
  description?: string;
  options?: string[];
}

/**
 * Block type definition in the grammar
 */
export interface GrammarBlock {
  type: string;
  displayName: string;
  args: BlockArgument[];
  description?: string;
  category?: string;
  colour?: number;
}

/**
 * Complete grammar definition
 */
export interface BlockGrammar {
  variables?: GrammarVariable[];
  routines?: GrammarRoutine[];
  blocks: GrammarBlock[];
}

/**
 * Program variable in the serialized format
 */
export interface ProgramVariable {
  name: string;
  type: string;
  value?: unknown;
}

/**
 * Program routine in the serialized format
 */
export interface ProgramRoutine {
  name: string;
  args: Array<{ name: string; type: string }>;
  body: ProgramInstruction[];
}

/**
 * Value reference types
 */
export interface VariableReference {
  var: string;
}

export interface CallReference {
  call: {
    name: string;
    args: Record<string, unknown>;
  };
}

export type ValueReference = VariableReference | CallReference | string | number | boolean;

/**
 * Program instruction in the serialized format
 */
export interface ProgramInstruction {
  type: string;
  [key: string]: unknown;
}

/**
 * Complete program in the serialized format
 */
export interface BattleProgram {
  variables: ProgramVariable[];
  routines: ProgramRoutine[];
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  primary?: string;
  secondary?: string;
  background?: string;
  text?: string;
  border?: string;
  shadow?: string;
  [key: string]: string | undefined;
}
