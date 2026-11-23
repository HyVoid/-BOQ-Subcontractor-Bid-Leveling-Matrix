import type {
  AwardVerdictTone,
  BidderKey,
  BidderSummary,
  BoqLineItem,
  ClarificationItem,
  ExecutiveInsight,
  GlobalParameters,
  LeveledRow,
  RedFlagStatus,
  WorkbookCalculationResult,
  WorkbookTotals,
} from './types';

/**
 * Treat null, undefined, NaN, or <= 0 raw unit rate as an omitted bid item.
 */
export function isOmittedRate(rawRate: number | null | undefined): boolean {
  return rawRate === null || rawRate === undefined || !Number.isFinite(rawRate) || rawRate <= 0;
}

/**
 * Standard competition ranking (1, 1, 3) where lower total cost earns a better rank (#1).
 */
export function computeAscendingRanks(values: number[]): number[] {
  return values.map((val) => {
    let betterCount = 0;
    for (const other of values) {
      if (other < val - 1e-9) {
        betterCount += 1;
      }
    }
    return betterCount + 1;
  });
}

function evaluateRedFlag(
  omitted: boolean,
  deviationPct: number | null,
  thresholdPct: number
): RedFlagStatus {
  if (omitted) return 'Omitted (Plugged)';
  if (deviationPct !== null && deviationPct > thresholdPct + 1e-9) return 'Red Flag';
  return 'Normal';
}

function computeDeviationPct(
  omitted: boolean,
  rawRate: number,
  benchmarkUnitRate: number
): number | null {
  if (omitted) return null;
  if (!Number.isFinite(benchmarkUnitRate) || benchmarkUnitRate <= 0) return 0;
  return ((rawRate - benchmarkUnitRate) / benchmarkUnitRate) * 100;
}

export function formatCurrency(
  amount: number,
  currencySymbol: string,
  fractionDigits = 2
): string {
  const safeSymbol = currencySymbol?.trim() || '$';
  const safeVal = Number.isFinite(amount) ? amount : 0;
  const formatted = Math.abs(safeVal).toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return safeVal < 0 ? `-${safeSymbol}${formatted}` : `${safeSymbol}${formatted}`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
  const safeVal = Number.isFinite(value) ? value : 0;
  return safeVal.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatSignedPercent(value: number | null, fractionDigits = 1): string {
  if (value === null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

export function formatPercent(value: number | null, fractionDigits = 1): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

export function formatSavedTimestamp(isoString: string | null): string {
  if (!isoString) return 'Not saved yet';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Not saved yet';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function buildClarificationDirective(
  row: LeveledRow,
  params: GlobalParameters,
  flaggedBidders: BidderKey[]
): string {
  const bidderDetails: string[] = [];
  if (flaggedBidders.includes('A')) {
    bidderDetails.push(`${params.bidderAName} (${formatSignedPercent(row.deviationPctA)})`);
  }
  if (flaggedBidders.includes('B')) {
    bidderDetails.push(`${params.bidderBName} (${formatSignedPercent(row.deviationPctB)})`);
  }
  if (flaggedBidders.includes('C')) {
    bidderDetails.push(`${params.bidderCName} (${formatSignedPercent(row.deviationPctC)})`);
  }

  return `Query ${bidderDetails.join('; ')} — unit rate exceeds +${formatNumber(params.unbalancedThresholdPct, 1)}% benchmark threshold. Request detailed rate breakdown and variation-order ceiling confirmation.`;
}

/**
 * Pure workbook calculation engine mirroring Sheets 00 -> 01 -> 02 -> 03.
 */
export function calculateWorkbook(
  boqItems: BoqLineItem[],
  params: GlobalParameters
): WorkbookCalculationResult {
  const upliftMultiplier = 1 + (Number.isFinite(params.penaltyUpliftPct) ? params.penaltyUpliftPct : 0) / 100;
  const thresholdPct = Number.isFinite(params.unbalancedThresholdPct) ? params.unbalancedThresholdPct : 25;
  const overrunPct = Number.isFinite(params.budgetOverrunThresholdPct) ? params.budgetOverrunThresholdPct : 5;

  // Sheet 02: Leveling & Deviation Engine
  const leveledRows: LeveledRow[] = boqItems.map((item) => {
    const qty = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
    const benchRate =
      Number.isFinite(item.benchmarkUnitRate) && item.benchmarkUnitRate >= 0
        ? item.benchmarkUnitRate
        : 0;

    const aOmitted = isOmittedRate(item.bidderARawRate);
    const bOmitted = isOmittedRate(item.bidderBRawRate);
    const cOmitted = isOmittedRate(item.bidderCRawRate);

    const aRaw = aOmitted ? 0 : (item.bidderARawRate as number);
    const bRaw = bOmitted ? 0 : (item.bidderBRawRate as number);
    const cRaw = cOmitted ? 0 : (item.bidderCRawRate as number);

    const validRates = [aRaw, bRaw, cRaw].filter((r) => r > 0);
    const peerAverageRate =
      validRates.length > 0
        ? validRates.reduce((acc, r) => acc + r, 0) / validRates.length
        : benchRate;

    const basePlugRate =
      params.plugRateMode === 'Peer Average Rate' ? peerAverageRate : benchRate;
    const plugStandardRate = basePlugRate * upliftMultiplier;

    const benchmarkTotal = qty * benchRate;

    const leveledRateA = aOmitted ? plugStandardRate : aRaw;
    const leveledRateB = bOmitted ? plugStandardRate : bRaw;
    const leveledRateC = cOmitted ? plugStandardRate : cRaw;

    const omissionPlugAmountA = aOmitted ? qty * plugStandardRate : 0;
    const omissionPlugAmountB = bOmitted ? qty * plugStandardRate : 0;
    const omissionPlugAmountC = cOmitted ? qty * plugStandardRate : 0;

    const leveledTotalA = qty * leveledRateA;
    const leveledTotalB = qty * leveledRateB;
    const leveledTotalC = qty * leveledRateC;

    const deviationPctA = computeDeviationPct(aOmitted, aRaw, benchRate);
    const deviationPctB = computeDeviationPct(bOmitted, bRaw, benchRate);
    const deviationPctC = computeDeviationPct(cOmitted, cRaw, benchRate);

    const redFlagStatusA = evaluateRedFlag(aOmitted, deviationPctA, thresholdPct);
    const redFlagStatusB = evaluateRedFlag(bOmitted, deviationPctB, thresholdPct);
    const redFlagStatusC = evaluateRedFlag(cOmitted, deviationPctC, thresholdPct);

    const triggersClarification =
      redFlagStatusA === 'Red Flag' ||
      redFlagStatusB === 'Red Flag' ||
      redFlagStatusC === 'Red Flag';

    return {
      id: item.id,
      boqCode: item.boqCode,
      itemName: item.itemName,
      unit: item.unit,
      quantity: qty,
      benchmarkUnitRate: benchRate,
      bidderARawRate: aRaw,
      bidderBRawRate: bRaw,
      bidderCRawRate: cRaw,
      bidderAOmitted: aOmitted,
      bidderBOmitted: bOmitted,
      bidderCOmitted: cOmitted,
      benchmarkTotal,
      peerAverageRate,
      plugStandardRate,
      leveledRateA,
      leveledRateB,
      leveledRateC,
      omissionPlugAmountA,
      omissionPlugAmountB,
      omissionPlugAmountC,
      leveledTotalA,
      leveledTotalB,
      leveledTotalC,
      deviationPctA,
      deviationPctB,
      deviationPctC,
      redFlagStatusA,
      redFlagStatusB,
      redFlagStatusC,
      triggersClarification,
    };
  });

  // Aggregate Totals
  const totals: WorkbookTotals = {
    itemCount: leveledRows.length,
    benchmarkTotal: 0,
    rawTotalA: 0,
    rawTotalB: 0,
    rawTotalC: 0,
    omissionPlugTotalA: 0,
    omissionPlugTotalB: 0,
    omissionPlugTotalC: 0,
    leveledTotalA: 0,
    leveledTotalB: 0,
    leveledTotalC: 0,
    redFlagCountA: 0,
    redFlagCountB: 0,
    redFlagCountC: 0,
    clarificationItemCount: 0,
  };

  let omittedCountA = 0;
  let omittedCountB = 0;
  let omittedCountC = 0;

  for (const row of leveledRows) {
    totals.benchmarkTotal += row.benchmarkTotal;
    totals.rawTotalA += row.quantity * row.bidderARawRate;
    totals.rawTotalB += row.quantity * row.bidderBRawRate;
    totals.rawTotalC += row.quantity * row.bidderCRawRate;
    totals.omissionPlugTotalA += row.omissionPlugAmountA;
    totals.omissionPlugTotalB += row.omissionPlugAmountB;
    totals.omissionPlugTotalC += row.omissionPlugAmountC;
    totals.leveledTotalA += row.leveledTotalA;
    totals.leveledTotalB += row.leveledTotalB;
    totals.leveledTotalC += row.leveledTotalC;

    if (row.bidderAOmitted) omittedCountA += 1;
    if (row.bidderBOmitted) omittedCountB += 1;
    if (row.bidderCOmitted) omittedCountC += 1;

    if (row.redFlagStatusA === 'Red Flag') totals.redFlagCountA += 1;
    if (row.redFlagStatusB === 'Red Flag') totals.redFlagCountB += 1;
    if (row.redFlagStatusC === 'Red Flag') totals.redFlagCountC += 1;
    if (row.triggersClarification) totals.clarificationItemCount += 1;
  }

  // Sheet 03 Upper Zone: Equalized Bid Ranking & Omission Summary
  const rawTotals = [totals.rawTotalA, totals.rawTotalB, totals.rawTotalC];
  const leveledTotals = [totals.leveledTotalA, totals.leveledTotalB, totals.leveledTotalC];
  const rawRanks = computeAscendingRanks(rawTotals);
  const leveledRanks = computeAscendingRanks(leveledTotals);

  const rawEntries: Array<{
    code: BidderKey;
    name: string;
    rawTotal: number;
    rawRank: number;
    omittedCount: number;
    omissionPlugTotal: number;
    leveledTotal: number;
    leveledRank: number;
    redFlagCount: number;
  }> = [
    {
      code: 'A',
      name: params.bidderAName || 'Subcontractor A',
      rawTotal: totals.rawTotalA,
      rawRank: rawRanks[0],
      omittedCount: omittedCountA,
      omissionPlugTotal: totals.omissionPlugTotalA,
      leveledTotal: totals.leveledTotalA,
      leveledRank: leveledRanks[0],
      redFlagCount: totals.redFlagCountA,
    },
    {
      code: 'B',
      name: params.bidderBName || 'Subcontractor B',
      rawTotal: totals.rawTotalB,
      rawRank: rawRanks[1],
      omittedCount: omittedCountB,
      omissionPlugTotal: totals.omissionPlugTotalB,
      leveledTotal: totals.leveledTotalB,
      leveledRank: leveledRanks[1],
      redFlagCount: totals.redFlagCountB,
    },
    {
      code: 'C',
      name: params.bidderCName || 'Subcontractor C',
      rawTotal: totals.rawTotalC,
      rawRank: rawRanks[2],
      omittedCount: omittedCountC,
      omissionPlugTotal: totals.omissionPlugTotalC,
      leveledTotal: totals.leveledTotalC,
      leveledRank: leveledRanks[2],
      redFlagCount: totals.redFlagCountC,
    },
  ];

  const bidderSummaries: BidderSummary[] = rawEntries.map((entry) => {
    const omissionShareOfRawPct =
      entry.rawTotal > 0 ? (entry.omissionPlugTotal / entry.rawTotal) * 100 : null;
    const varianceVsBenchmarkPct =
      totals.benchmarkTotal > 0
        ? ((entry.leveledTotal - totals.benchmarkTotal) / totals.benchmarkTotal) * 100
        : null;

    const isFalseLowBid =
      totals.itemCount > 0 && entry.rawRank === 1 && entry.leveledRank > 1 && entry.omittedCount > 0;
    const isOverBudget =
      varianceVsBenchmarkPct !== null && varianceVsBenchmarkPct > overrunPct + 1e-9;

    let awardConclusion = 'Compliant — Non-Lowest';
    let verdictTone: AwardVerdictTone = 'neutral';

    if (totals.itemCount === 0) {
      awardConclusion = 'Awaiting BOQ Data';
      verdictTone = 'neutral';
    } else if (isFalseLowBid) {
      awardConclusion = 'False Low Bid (Omissions)';
      verdictTone = 'danger';
    } else if (isOverBudget) {
      awardConclusion = 'Over Budget Alert';
      verdictTone = 'danger';
    } else if (entry.leveledRank === 1 && entry.redFlagCount > 0) {
      awardConclusion = 'True Lowest — Clarify Red Flags';
      verdictTone = 'danger';
    } else if (entry.leveledRank === 1) {
      awardConclusion = 'Recommended Award';
      verdictTone = 'positive';
    } else if (entry.redFlagCount > 0) {
      awardConclusion = 'Unbalanced Pricing Risk';
      verdictTone = 'danger';
    }

    return {
      bidderCode: entry.code,
      bidderName: entry.name,
      rawTotal: entry.rawTotal,
      rawRank: entry.rawRank,
      omittedCount: entry.omittedCount,
      omissionPlugTotal: entry.omissionPlugTotal,
      omissionShareOfRawPct,
      leveledTotal: entry.leveledTotal,
      leveledRank: entry.leveledRank,
      redFlagCount: entry.redFlagCount,
      varianceVsBenchmarkPct,
      awardConclusion,
      verdictTone,
      isFalseLowBid,
      isOverBudget,
      currencyDisplayLabel: formatCurrency(entry.leveledTotal, params.currencySymbol, 2),
    };
  });

  // Sheet 03 Lower Zone: Unbalanced Bidding Red-Flag & Tender Clarification List
  const clarifications: ClarificationItem[] = leveledRows
    .filter((row) => row.triggersClarification)
    .map((row) => {
      const flaggedBidders: BidderKey[] = [];
      if (row.redFlagStatusA === 'Red Flag') flaggedBidders.push('A');
      if (row.redFlagStatusB === 'Red Flag') flaggedBidders.push('B');
      if (row.redFlagStatusC === 'Red Flag') flaggedBidders.push('C');

      return {
        id: row.id,
        boqCode: row.boqCode,
        itemName: row.itemName,
        unit: row.unit,
        quantity: row.quantity,
        benchmarkUnitRate: row.benchmarkUnitRate,
        bidderARate: row.bidderARawRate,
        bidderADeviationPct: row.deviationPctA,
        bidderAFlag: row.redFlagStatusA,
        bidderBRate: row.bidderBRawRate,
        bidderBDeviationPct: row.deviationPctB,
        bidderBFlag: row.redFlagStatusB,
        bidderCRate: row.bidderCRawRate,
        bidderCDeviationPct: row.deviationPctC,
        bidderCFlag: row.redFlagStatusC,
        clarificationDirective: buildClarificationDirective(row, params, flaggedBidders),
        flaggedBidders,
      };
    });

  // Executive Insight Synthesis
  const insight = buildExecutiveInsight(bidderSummaries, totals, params);

  return {
    leveledRows,
    totals,
    bidderSummaries,
    clarifications,
    insight,
  };
}

function buildExecutiveInsight(
  summaries: BidderSummary[],
  totals: WorkbookTotals,
  params: GlobalParameters
): ExecutiveInsight {
  if (totals.itemCount === 0) {
    return {
      headline: 'No BOQ items loaded yet',
      summary:
        'Add line items or import a CSV in Sheet 01 (BOQ & Raw Bids) to activate automated omission plug-rate leveling and unbalanced pricing detection.',
      actionRequired: false,
      hasFalseLowBid: false,
      falseLowBidderName: null,
      recommendedBidderName: null,
    };
  }

  const falseLow = summaries.find((s) => s.isFalseLowBid) ?? null;
  const trueWinner = summaries.find((s) => s.leveledRank === 1) ?? summaries[0];
  const sym = params.currencySymbol || '$';

  if (falseLow) {
    const gapVsWinner = falseLow.leveledTotal - trueWinner.leveledTotal;
    const summaryParts = [
      `${falseLow.bidderName} appeared #1 on raw price (${formatCurrency(falseLow.rawTotal, sym, 0)}) by omitting ${falseLow.omittedCount} BOQ item${falseLow.omittedCount === 1 ? '' : 's'} worth ${formatCurrency(falseLow.omissionPlugTotal, sym, 0)} under ${params.plugRateMode} leveling.`,
      `On an equalized scope basis, ${trueWinner.bidderName} is the true lowest bidder at ${formatCurrency(trueWinner.leveledTotal, sym, 0)} (${formatCurrency(gapVsWinner, sym, 0)} lower than ${falseLow.bidderName}'s leveled total).`,
    ];
    if (totals.clarificationItemCount > 0) {
      summaryParts.push(
        `Issue formal rate clarifications on ${totals.clarificationItemCount} unbalanced line item${totals.clarificationItemCount === 1 ? '' : 's'} exceeding +${formatNumber(params.unbalancedThresholdPct, 1)}% above benchmark before award.`
      );
    }

    return {
      headline: `False Low Bid Unmasked: ${falseLow.bidderName} drops from Raw #1 to Leveled #${falseLow.leveledRank}`,
      summary: summaryParts.join(' '),
      actionRequired: true,
      hasFalseLowBid: true,
      falseLowBidderName: falseLow.bidderName,
      recommendedBidderName: trueWinner.bidderName,
    };
  }

  const anyOverBudget = summaries.some((s) => s.isOverBudget);
  const actionRequired = totals.clarificationItemCount > 0 || anyOverBudget;
  const summaryParts = [
    `${trueWinner.bidderName} holds the true lowest leveled total at ${formatCurrency(trueWinner.leveledTotal, sym, 0)} (${formatSignedPercent(trueWinner.varianceVsBenchmarkPct)} vs. internal benchmark of ${formatCurrency(totals.benchmarkTotal, sym, 0)}).`,
  ];

  if (totals.clarificationItemCount > 0) {
    summaryParts.push(
      `${totals.clarificationItemCount} BOQ item${totals.clarificationItemCount === 1 ? '' : 's'} exceed the +${formatNumber(params.unbalancedThresholdPct, 1)}% unbalanced-pricing threshold and require pre-award clarification.`
    );
  } else {
    summaryParts.push(
      `No bidder unit rates exceed the +${formatNumber(params.unbalancedThresholdPct, 1)}% unbalanced-pricing threshold.`
    );
  }

  return {
    headline: `True Lowest Leveled Bid: ${trueWinner.bidderName} (${formatCurrency(trueWinner.leveledTotal, sym, 0)})`,
    summary: summaryParts.join(' '),
    actionRequired,
    hasFalseLowBid: false,
    falseLowBidderName: null,
    recommendedBidderName: trueWinner.bidderName,
  };
}
