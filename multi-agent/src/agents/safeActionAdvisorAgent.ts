// src/agents/safeActionAdvisorAgent.ts
import { Context, AgentResult } from "../utils/types";
import { processPsychologicalManipulation } from "./psychologicalManipulationAgent";
import { processSensitiveInfoRisk } from "./sensitiveInfoRiskAgent";

export async function processSafeActionAdvisor(input: string, ctx: Context): Promise<AgentResult> {
  const manipulation = ctx.intermediate?.psychologicalManipulation || 
                       (await processPsychologicalManipulation(input, ctx)).psychologicalManipulation;
  const sensitive = ctx.intermediate?.sensitiveInfoRisk || 
                    (await processSensitiveInfoRisk(input, ctx)).sensitiveInfoRisk;

  const recommendations: string[] = [];

  if (sensitive?.containsOTP || sensitive?.containsPassword) {
    recommendations.push("NEVER share OTPs, passwords, or login PINs. Real organizations will never ask for these details.");
  }
  if (sensitive?.containsBankDetails) {
    recommendations.push("Do not share credit/debit card numbers, CVV, or bank credentials. Contact your bank directly through their official number.");
  }
  if (sensitive?.containsPersonalID) {
    recommendations.push("Exercise extreme caution before sharing national identification info, passport numbers, or SSN.");
  }

  if (manipulation?.artificialUrgency) {
    recommendations.push("Do not rush. Scammers use artificial urgency to prevent you from thinking clearly.");
  }
  if (manipulation?.fearInduction) {
    recommendations.push("Do not panic. Threats of account suspension, fines, or legal action are typical pressure tactics.");
  }
  if (manipulation?.authorityPressure) {
    recommendations.push("Verify the sender's identity. Do not assume the sender is who they claim to be, even if they use official names.");
  }
  if (manipulation?.greed) {
    recommendations.push("Be skeptical of unexpected offers, lottery wins, or gifts that require upfront payment or registration.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Always remain cautious when interacting with digital communications, even if no explicit risk was identified.");
  }

  return {
    safeActionAdvisor: {
      recommendations
    }
  };
}
