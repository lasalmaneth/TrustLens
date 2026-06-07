import { processMessageUnderstanding } from "./agents/messageUnderstandingAgent";
import { processPsychologicalManipulation } from "./agents/psychologicalManipulationAgent";
import { processSensitiveInfoRisk } from "./agents/sensitiveInfoRiskAgent";
import { processRiskScoring } from "./agents/riskScoringAgent";
import { processSafeActionAdvisor } from "./agents/safeActionAdvisorAgent";
import { AggregatedResult, AgentResult, Context } from "./utils/types";
import logger from "./utils/logger";
import defaultConfig from "./config/defaultConfig";

// Simple orchestrator that runs all agents in parallel and aggregates results.
export async function orchestrator(rawText: string, extraContext: Partial<Context> = {}): Promise<AggregatedResult> {
  const context: Context = { ...defaultConfig.contextDefaults, ...extraContext };
  logger.info("Orchestrator received input", rawText);

  const promises: Promise<AgentResult>[] = [
    processMessageUnderstanding(rawText, context),
    processPsychologicalManipulation(rawText, context),
    processSensitiveInfoRisk(rawText, context),
    processRiskScoring(rawText, context),
    processSafeActionAdvisor(rawText, context),
  ];

  const results = await Promise.all(promises);

  // Simple aggregation – combine all agent outputs into a single object.
  const aggregated: AggregatedResult = results.reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {} as AggregatedResult);

  logger.info("Aggregated result", aggregated);
  return aggregated;
}

// If run directly, read from stdin for demo purposes.
if (require.main === module) {
  const stdin = process.stdin;
  let data = "";
  stdin.setEncoding("utf8");
  stdin.on("data", chunk => (data += chunk));
  stdin.on("end", async () => {
    const result = await orchestrator(data.trim());
    console.log(JSON.stringify(result, null, 2));
  });
}
