// src/agents/messageUnderstandingAgent.ts
import { Context, AgentResult } from "../utils/types";

export interface MessageContext {
  content: string;
  sender?: string;
  deadline?: string;
}

export interface UnderstandingResult {
  baseMessage: string;
  claims: string[];
  actions: string[];
  urgency?: string;
}

/**
 * Extracts core information from raw text.
 * - baseMessage: cleaned message content.
 * - claims: identified self‑descriptions (e.g., "Bank Officer").
 * - actions: requested actions (e.g., "Send OTP").
 * - urgency: parsed deadline/urgency phrase if present.
 */
export function understandMessage(ctx: MessageContext): UnderstandingResult {
  const { content } = ctx;
  // Simple regex based extraction (replace with NLP model later)
  const claimRegex = /(?:I am|I'm|as a)\s+([A-Za-z\s]+?)(?:\.|,|;)/gi;
  const actionRegex = /(?:please|kindly)\s+(\w+(?:\s+\w+)*?)(?:\.|!|\?)/gi;
  const urgencyRegex = /(within|in)\s+(\d+)\s*(seconds?|minutes?|hours?|days?)/i;

  const claims: string[] = [];
  let match;
  while ((match = claimRegex.exec(content)) !== null) {
    claims.push(match[1].trim());
  }

  const actions: string[] = [];
  while ((match = actionRegex.exec(content)) !== null) {
    actions.push(match[1].trim());
  }

  let urgency: string | undefined;
  if ((match = urgencyRegex.exec(content))) {
    urgency = `${match[1]} ${match[2]} ${match[3]}`;
  }

  const baseMessage = content.replace(/\s+/g, ' ').trim();
  return { baseMessage, claims, actions, urgency };
}

export async function processMessageUnderstanding(input: string, _ctx: Context): Promise<AgentResult> {
  const result = understandMessage({ content: input });
  return { messageUnderstanding: result };
}

