// src/agents/psychologicalManipulationAgent.ts
import { Context } from "../utils/types";
import { AgentResult } from "../utils/types";

/**
 * Detects manipulation tactics in the message.
 * Returns an object with boolean flags for each tactic.
 */
export async function processPsychologicalManipulation(input: string, _ctx: Context): Promise<AgentResult> {
  const lower = input.toLowerCase();
  const result = {
    fearInduction: /\b(?:scared|danger|threat)\b/.test(lower),
    artificialUrgency: /\bwithin\s+\d+\s+(seconds?|minutes?|hours?|days?)\b/.test(lower),
    authorityPressure: /\b(?:as\s+your\s+bank\s+officer|bank\s+official)\b/.test(lower),
    greed: /\b(?:exclusive|limited|offer)\b/.test(lower),
    scarcity: /\b(?:only\s+\d+|running\s+out)\b/.test(lower),
    emotionalGuilt: /\b(?:sorry\s+to\s+burden|I\s+need\s+your\s+help)\b/.test(lower),
    trustExploitation: /\b(?:trusted|secure|verified)\b/.test(lower),
  };
  return { psychologicalManipulation: result } as any;
}
