// src/types.ts
export interface ExtractedMessage {
  content: string;
  senderClaim?: string; // e.g., "Bank Officer"
  actions?: string[]; // e.g., ["Send OTP"]
  urgency?: string; // e.g., "Within 10 minutes"
}

export interface ManipulationAnalysis {
  fearInduction?: boolean;
  artificialUrgency?: boolean;
  authorityPressure?: boolean;
  greed?: boolean;
  scarcity?: boolean;
  emotionalGuilt?: boolean;
  trustExploitation?: boolean;
}

export interface SensitiveInfoRisk {
  containsOTP?: boolean;
  containsPassword?: boolean;
  containsBankDetails?: boolean;
  containsPersonalID?: boolean;
}

export interface RiskScore {
  severity: "Low" | "Medium" | "High";
  percentage: number; // 0-100
}
