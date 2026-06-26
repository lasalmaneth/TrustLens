import { processMessageUnderstanding } from "./agents/messageUnderstandingAgent";
import { processPsychologicalManipulation } from "./agents/psychologicalManipulationAgent";
import { processSensitiveInfoRisk } from "./agents/sensitiveInfoRiskAgent";
import { processRiskScoring } from "./agents/riskScoringAgent";
import { processSafeActionAdvisor } from "./agents/safeActionAdvisorAgent";
import { AggregatedResult, Context } from "./utils/types";
import logger from "./utils/logger";
import defaultConfig from "./config/defaultConfig";

// Orchestrator that runs agents in sequence to pass intermediate results.
export async function orchestrator(rawText: string, extraContext: Partial<Context> = {}): Promise<AggregatedResult> {
  const context: Context = { ...defaultConfig.contextDefaults, ...extraContext };
  logger.info("Orchestrator received input", rawText);

  const messageUnderstanding = await processMessageUnderstanding(rawText, context);
  const psychologicalManipulation = await processPsychologicalManipulation(rawText, context);
  const sensitiveInfoRisk = await processSensitiveInfoRisk(rawText, context);

  const intermediate = {
    ...messageUnderstanding,
    ...psychologicalManipulation,
    ...sensitiveInfoRisk,
  };

  const scoringContext = { ...context, intermediate };
  const riskScoring = await processRiskScoring(rawText, scoringContext);

  const advisorContext = { ...context, intermediate, ...riskScoring };
  const safeActionAdvisor = await processSafeActionAdvisor(rawText, advisorContext);

  const aggregated: AggregatedResult = {
    ...intermediate,
    ...riskScoring,
    ...safeActionAdvisor,
  };

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

