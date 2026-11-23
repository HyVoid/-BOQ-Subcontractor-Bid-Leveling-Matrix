export type PlugRateMode = 'Benchmark Rate' | 'Peer Average Rate';

export type SheetTabId = 'parameters' | 'boq-input' | 'leveling-engine' | 'dashboard';

export type BidderKey = 'A' | 'B' | 'C';

export type RedFlagStatus = 'Normal' | 'Red Flag' | 'Omitted (Plugged)';

export interface GlobalParameters {
  currencySymbol: string;
  plugRateMode: PlugRateMode;
  penaltyUpliftPct: number; // e.g., 0 for 0.0%, 10 for 10.0%
  unbalancedThresholdPct: number; // e.g., 25 for 25.0%
  budgetOverrunThresholdPct: number; // e.g., 5 for 5.0%
  bidderAName: string;
  bidderBName: string;
  bidderCName: string;
}

export interface BoqLineItem {
  id: string;
  boqCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  benchmarkUnitRate: number;
  bidderARawRate: number | null;
  bidderBRawRate: number | null;
  bidderCRawRate: number | null;
}

export interface LeveledRow {
  // 8 mirrored input columns
  id: string;
  boqCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  benchmarkUnitRate: number;
  bidderARawRate: number; // 0 when omitted
  bidderBRawRate: number; // 0 when omitted
  bidderCRawRate: number; // 0 when omitted
  bidderAOmitted: boolean;
  bidderBOmitted: boolean;
  bidderCOmitted: boolean;

  // 19 core calculated columns
  benchmarkTotal: number;
  peerAverageRate: number;
  plugStandardRate: number;
  leveledRateA: number;
  leveledRateB: number;
  leveledRateC: number;
  omissionPlugAmountA: number;
  omissionPlugAmountB: number;
  omissionPlugAmountC: number;
  leveledTotalA: number;
  leveledTotalB: number;
  leveledTotalC: number;
  deviationPctA: number | null; // null when omitted
  deviationPctB: number | null;
  deviationPctC: number | null;
  redFlagStatusA: RedFlagStatus;
  redFlagStatusB: RedFlagStatus;
  redFlagStatusC: RedFlagStatus;
  triggersClarification: boolean;
}

export type AwardVerdictTone = 'positive' | 'danger' | 'neutral';

export interface BidderSummary {
  bidderCode: BidderKey;
  bidderName: string;
  rawTotal: number;
  rawRank: number;
  omittedCount: number;
  omissionPlugTotal: number;
  omissionShareOfRawPct: number | null;
  leveledTotal: number;
  leveledRank: number;
  redFlagCount: number;
  varianceVsBenchmarkPct: number | null;
  awardConclusion: string;
  verdictTone: AwardVerdictTone;
  isFalseLowBid: boolean;
  isOverBudget: boolean;
  currencyDisplayLabel: string;
}

export interface ClarificationItem {
  id: string;
  boqCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  benchmarkUnitRate: number;
  bidderARate: number;
  bidderADeviationPct: number | null;
  bidderAFlag: RedFlagStatus;
  bidderBRate: number;
  bidderBDeviationPct: number | null;
  bidderBFlag: RedFlagStatus;
  bidderCRate: number;
  bidderCDeviationPct: number | null;
  bidderCFlag: RedFlagStatus;
  clarificationDirective: string;
  flaggedBidders: BidderKey[];
}

export interface WorkbookTotals {
  itemCount: number;
  benchmarkTotal: number;
  rawTotalA: number;
  rawTotalB: number;
  rawTotalC: number;
  omissionPlugTotalA: number;
  omissionPlugTotalB: number;
  omissionPlugTotalC: number;
  leveledTotalA: number;
  leveledTotalB: number;
  leveledTotalC: number;
  redFlagCountA: number;
  redFlagCountB: number;
  redFlagCountC: number;
  clarificationItemCount: number;
}

export interface ExecutiveInsight {
  headline: string;
  summary: string;
  actionRequired: boolean;
  hasFalseLowBid: boolean;
  falseLowBidderName: string | null;
  recommendedBidderName: string | null;
}

export interface WorkbookCalculationResult {
  leveledRows: LeveledRow[];
  totals: WorkbookTotals;
  bidderSummaries: BidderSummary[];
  clarifications: ClarificationItem[];
  insight: ExecutiveInsight;
}

export interface WorkbookState {
  parameters: GlobalParameters;
  boqItems: BoqLineItem[];
  lastSavedAt: string | null;
}

export interface BackupPayload {
  schemaVersion: 1;
  app: 'theseus-workshop-boq-bid-leveling';
  exportedAt: string;
  parameters: GlobalParameters;
  boqItems: BoqLineItem[];
}
