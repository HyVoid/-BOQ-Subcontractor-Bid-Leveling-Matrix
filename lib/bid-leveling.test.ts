import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWorkbook, computeAscendingRanks, isOmittedRate } from './bid-leveling';
import { DEFAULT_BOQ_ITEMS, DEFAULT_PARAMETERS } from './seed-data';
import {
  createBackupPayload,
  exportBoqToCsv,
  getBackupFilename,
  parseBoqCsv,
  validateBackupJson,
} from './data-io';
import type { BoqLineItem, GlobalParameters } from './types';

test('isOmittedRate detects null, undefined, zero, and negative values', () => {
  assert.equal(isOmittedRate(null), true);
  assert.equal(isOmittedRate(undefined), true);
  assert.equal(isOmittedRate(0), true);
  assert.equal(isOmittedRate(-5), true);
  assert.equal(isOmittedRate(0.01), false);
});

test('computeAscendingRanks handles distinct values and ties with competition ranking', () => {
  assert.deepEqual(computeAscendingRanks([300, 100, 200]), [3, 1, 2]);
  assert.deepEqual(computeAscendingRanks([100, 100, 200]), [1, 1, 3]);
});

test('seed dataset unmasks Subcontractor A as a False Low Bid and ranks Subcontractor B #1 leveled', () => {
  const result = calculateWorkbook(DEFAULT_BOQ_ITEMS, DEFAULT_PARAMETERS);

  assert.equal(result.leveledRows.length, 12);
  const [subA, subB, subC] = result.bidderSummaries;

  // Subcontractor A looks cheapest raw, but drops after omission leveling
  assert.equal(subA.rawRank, 1);
  assert.equal(subA.omittedCount, 3);
  assert.equal(subA.omissionPlugTotal, 269500);
  assert.equal(subA.isFalseLowBid, true);
  assert.equal(subA.leveledRank, 3);
  assert.equal(subA.awardConclusion, 'False Low Bid (Omissions)');
  assert.equal(subA.redFlagCount, 3);

  // Subcontractor B is the true lowest leveled bidder with 0 omissions & 0 red flags
  assert.equal(subB.omittedCount, 0);
  assert.equal(subB.omissionPlugTotal, 0);
  assert.equal(subB.leveledRank, 1);
  assert.equal(subB.redFlagCount, 0);
  assert.equal(subB.awardConclusion, 'Recommended Award');

  // Subcontractor C has 1 omission and 2 red flags
  assert.equal(subC.omittedCount, 1);
  assert.equal(subC.omissionPlugTotal, 34000);
  assert.equal(subC.redFlagCount, 2);

  // Clarification list contains exactly 5 items (3 from A, 2 from C)
  assert.equal(result.clarifications.length, 5);
  assert.equal(result.insight.hasFalseLowBid, true);
});

test('Peer Average Rate plug mode and penalty uplift propagate accurately', () => {
  const items: BoqLineItem[] = [
    {
      id: 't1',
      boqCode: '001',
      itemName: 'Waterproofing',
      unit: 'm²',
      quantity: 100,
      benchmarkUnitRate: 50,
      bidderARawRate: null, // omitted
      bidderBRawRate: 60,
      bidderCRawRate: 80,
    },
  ];
  const params: GlobalParameters = {
    ...DEFAULT_PARAMETERS,
    plugRateMode: 'Peer Average Rate',
    penaltyUpliftPct: 10, // +10%
    unbalancedThresholdPct: 25,
  };

  const result = calculateWorkbook(items, params);
  const row = result.leveledRows[0];

  // Peer average of (60, 80) = 70; with +10% uplift => 77
  assert.equal(row.peerAverageRate, 70);
  assert.ok(Math.abs(row.plugStandardRate - 77) < 1e-6);
  assert.ok(Math.abs(row.leveledRateA - 77) < 1e-6);
  assert.ok(Math.abs(row.omissionPlugAmountA - 7700) < 1e-6);
  assert.ok(Math.abs(row.leveledTotalA - 7700) < 1e-6);
  assert.equal(row.redFlagStatusA, 'Omitted (Plugged)');
  // Subcontractor B: (60-50)/50 = +20% -> Normal
  assert.equal(row.redFlagStatusB, 'Normal');
  // Subcontractor C: (80-50)/50 = +60% > 25% -> Red Flag
  assert.equal(row.redFlagStatusC, 'Red Flag');
  assert.equal(row.triggersClarification, true);
});

test('Peer Average Rate falls back to Benchmark Rate when all 3 bidders omit an item', () => {
  const items: BoqLineItem[] = [
    {
      id: 't2',
      boqCode: '002',
      itemName: 'Provisional Sum',
      unit: 'LS',
      quantity: 1,
      benchmarkUnitRate: 10000,
      bidderARawRate: null,
      bidderBRawRate: null,
      bidderCRawRate: null,
    },
  ];
  const params: GlobalParameters = {
    ...DEFAULT_PARAMETERS,
    plugRateMode: 'Peer Average Rate',
    penaltyUpliftPct: 0,
  };

  const result = calculateWorkbook(items, params);
  const row = result.leveledRows[0];
  assert.equal(row.peerAverageRate, 10000);
  assert.equal(row.plugStandardRate, 10000);
  assert.equal(row.leveledTotalA, 10000);
  assert.equal(row.triggersClarification, false);
});

test('Backup export and validation round-trips cleanly and rejects corrupted input', () => {
  const payload = createBackupPayload(DEFAULT_PARAMETERS, DEFAULT_BOQ_ITEMS);
  const json = JSON.stringify(payload);
  const valid = validateBackupJson(json);
  assert.equal(valid.ok, true);
  assert.equal(valid.data?.boqItems.length, 12);

  const invalidJson = validateBackupJson('{bad json');
  assert.equal(invalidJson.ok, false);

  const wrongApp = validateBackupJson(JSON.stringify({ app: 'other', schemaVersion: 1 }));
  assert.equal(wrongApp.ok, false);

  const filename = getBackupFilename(new Date('2026-11-21T12:00:00Z'));
  assert.equal(filename, 'boq-bid-leveling-matrix-backup-2026-11-21.json');
});

test('CSV export and bulk import round-trip with quoted commas and blank omissions', () => {
  const csv = exportBoqToCsv(DEFAULT_BOQ_ITEMS.slice(0, 3), DEFAULT_PARAMETERS);
  const parsed = parseBoqCsv(csv);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.items.length, 3);
  assert.equal(parsed.items[1].bidderARawRate, null); // Omission preserved

  const quotedCsv = `BOQ Code,Item Description,Unit,Quantity,Benchmark Rate,A,B,C\n0199,"Granite Paving, Honed Finish",m²,250,$80.00,,78.50,110.00`;
  const parsedQuoted = parseBoqCsv(quotedCsv);
  assert.equal(parsedQuoted.ok, true);
  assert.equal(parsedQuoted.items[0].itemName, 'Granite Paving, Honed Finish');
  assert.equal(parsedQuoted.items[0].benchmarkUnitRate, 80);
  assert.equal(parsedQuoted.items[0].bidderARawRate, null);

  const badCsv = `BOQ Code,Item Description,Unit,Quantity,Benchmark Rate\n0200,Bad Row,m²,-10,50`;
  const parsedBad = parseBoqCsv(badCsv);
  assert.equal(parsedBad.ok, false);
  assert.ok(parsedBad.errors[0].includes('Quantity must be a positive number'));
});
