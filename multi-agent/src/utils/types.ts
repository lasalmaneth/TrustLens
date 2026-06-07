// src/utils/types.ts
export interface Context {
  // Add any contextual data needed by agents
  [key: string]: any;
}

export interface AgentResult {
  // Each agent will return an object with a unique key
  [key: string]: any;
}

export interface AggregatedResult extends AgentResult {}
