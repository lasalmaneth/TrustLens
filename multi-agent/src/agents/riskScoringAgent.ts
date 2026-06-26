// src/agents/riskScoringAgent.ts
import { Context, AgentResult } from "../utils/types";
import { processPsychologicalManipulation } from "./psychologicalManipulationAgent";
import { processSensitiveInfoRisk } from "./sensitiveInfoRiskAgent";

export async function processRiskScoring(input: string, ctx: Context): Promise<AgentResult> {
  const manipulation = ctx.intermediate?.psychologicalManipulation || 
                       (await processPsychologicalManipulation(input, ctx)).psychologicalManipulation;
  const sensitive = ctx.intermediate?.sensitiveInfoRisk || 
                    (await processSensitiveInfoRisk(input, ctx)).sensitiveInfoRisk;

  let score = 0;

  if (manipulation?.fearInduction) score += 25;
  if (manipulation?.artificialUrgency) score += 25;
  if (manipulation?.authorityPressure) score += 20;
  if (manipulation?.greed) score += 15;
  if (manipulation?.scarcity) score += 15;
  if (manipulation?.emotionalGuilt) score += 15;
  if (manipulation?.trustExploitation) score += 10;

  if (sensitive?.containsOTP) score += 45;
  if (sensitive?.containsPassword) score += 45;
  if (sensitive?.containsBankDetails) score += 40;
  if (sensitive?.containsPersonalID) score += 25;

  const percentage = Math.min(score, 100);

  let severity: "Low" | "Medium" | "High" = "Low";
  if (percentage >= 70) {
    severity = "High";
  } else if (percentage >= 35) {
    severity = "Medium";
  }

  return {
    riskScore: {
      severity,
      percentage
    }
  };
}
