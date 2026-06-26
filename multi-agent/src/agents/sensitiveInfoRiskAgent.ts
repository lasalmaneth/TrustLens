// src/agents/sensitiveInfoRiskAgent.ts
import { Context, AgentResult } from "../utils/types";

export async function processSensitiveInfoRisk(input: string, _ctx: Context): Promise<AgentResult> {
  const lower = input.toLowerCase();
  const result = {
    containsOTP: /\b(?:otp|one-time password|one time password|verification code|verification pin|passcode|one-time-pin)\b/.test(lower),
    containsPassword: /\b(?:password|passphrase|pin|credentials|login)\b/.test(lower),
    containsBankDetails: /\b(?:bank account|account number|credit card|debit card|iban|routing number|cvv|cvc)\b/.test(lower),
    containsPersonalID: /\b(?:nic|national identity card|ssn|social security number|passport number|id number|identity card)\b/.test(lower),
  };
  return { sensitiveInfoRisk: result };
}
