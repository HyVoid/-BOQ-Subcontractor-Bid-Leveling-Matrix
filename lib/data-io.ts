import type {
  BackupPayload,
  BoqLineItem,
  ClarificationItem,
  GlobalParameters,
  PlugRateMode,
} from './types';
import { formatNumber, formatSignedPercent } from './bid-leveling';

const VALID_PLUG_MODES: PlugRateMode[] = ['Benchmark Rate', 'Peer Average Rate'];

export function createBackupPayload(
  parameters: GlobalParameters,
  boqItems: BoqLineItem[]
): BackupPayload {
  return {
    schemaVersion: 1,
    app: 'theseus-workshop-boq-bid-leveling',
    exportedAt: new Date().toISOString(),
    parameters,
    boqItems,
  };
}

export function getBackupFilename(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `boq-bid-leveling-matrix-backup-${year}-${month}-${day}.json`;
}

export interface BackupValidationResult {
  ok: boolean;
  error?: string;
  data?: {
    parameters: GlobalParameters;
    boqItems: BoqLineItem[];
  };
}

function parseOptionalRate(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0) return null;
  return num === 0 ? null : num;
}

export function validateBackupJson(rawText: string): BackupValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { ok: false, error: 'Invalid JSON file. Please select a valid backup exported from this tool.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'Backup payload must be a JSON object.' };
  }

  const obj = parsed as Record<string, unknown>;
  if (obj.app !== 'theseus-workshop-boq-bid-leveling' || obj.schemaVersion !== 1) {
    return {
      ok: false,
      error: 'Unrecognized backup format. Expected a BOQ Bid Leveling Matrix v1 backup file.',
    };
  }

  const p = obj.parameters as Record<string, unknown> | undefined;
  if (!p || typeof p !== 'object') {
    return { ok: false, error: 'Backup file is missing global parameters.' };
  }

  const plugRateMode = p.plugRateMode as PlugRateMode;
  if (!VALID_PLUG_MODES.includes(plugRateMode)) {
    return {
      ok: false,
      error: 'Invalid plug rate mode in backup file. Expected "Benchmark Rate" or "Peer Average Rate".',
    };
  }

  const penaltyUpliftPct = Number(p.penaltyUpliftPct);
  const unbalancedThresholdPct = Number(p.unbalancedThresholdPct);
  const budgetOverrunThresholdPct = Number(p.budgetOverrunThresholdPct);

  if (
    !Number.isFinite(penaltyUpliftPct) ||
    !Number.isFinite(unbalancedThresholdPct) ||
    !Number.isFinite(budgetOverrunThresholdPct)
  ) {
    return { ok: false, error: 'Backup parameters contain non-numeric threshold values.' };
  }

  const parameters: GlobalParameters = {
    currencySymbol: typeof p.currencySymbol === 'string' && p.currencySymbol.trim() ? p.currencySymbol.trim() : '$',
    plugRateMode,
    penaltyUpliftPct,
    unbalancedThresholdPct,
    budgetOverrunThresholdPct,
    bidderAName:
      typeof p.bidderAName === 'string' && p.bidderAName.trim()
        ? p.bidderAName.trim()
        : 'Subcontractor A',
    bidderBName:
      typeof p.bidderBName === 'string' && p.bidderBName.trim()
        ? p.bidderBName.trim()
        : 'Subcontractor B',
    bidderCName:
      typeof p.bidderCName === 'string' && p.bidderCName.trim()
        ? p.bidderCName.trim()
        : 'Subcontractor C',
  };

  if (!Array.isArray(obj.boqItems)) {
    return { ok: false, error: 'Backup file is missing the BOQ items array.' };
  }

  const boqItems: BoqLineItem[] = [];
  for (let i = 0; i < obj.boqItems.length; i += 1) {
    const raw = obj.boqItems[i] as Record<string, unknown>;
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: `BOQ item at row ${i + 1} is malformed.` };
    }
    const boqCode = typeof raw.boqCode === 'string' ? raw.boqCode.trim() : '';
    const itemName = typeof raw.itemName === 'string' ? raw.itemName.trim() : '';
    const unit = typeof raw.unit === 'string' ? raw.unit.trim() : '';
    const quantity = Number(raw.quantity);
    const benchmarkUnitRate = Number(raw.benchmarkUnitRate);

    if (!boqCode || !itemName) {
      return {
        ok: false,
        error: `BOQ item at row ${i + 1} is missing a BOQ Code or Item Description.`,
      };
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return {
        ok: false,
        error: `BOQ item "${boqCode}" has an invalid quantity (must be greater than 0).`,
      };
    }
    if (!Number.isFinite(benchmarkUnitRate) || benchmarkUnitRate < 0) {
      return {
        ok: false,
        error: `BOQ item "${boqCode}" has an invalid benchmark unit rate.`,
      };
    }

    boqItems.push({
      id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `boq-imported-${i + 1}`,
      boqCode,
      itemName,
      unit: unit || 'LS',
      quantity,
      benchmarkUnitRate,
      bidderARawRate: parseOptionalRate(raw.bidderARawRate),
      bidderBRawRate: parseOptionalRate(raw.bidderBRawRate),
      bidderCRawRate: parseOptionalRate(raw.bidderCRawRate),
    });
  }

  return { ok: true, data: { parameters, boqItems } };
}

/**
 * RFC-4180 compliant single-pass CSV parser handling quoted fields, commas, and escaped quotes.
 */
export function parseCsvMatrix(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  const text = csvText.replace(/^\uFEFF/, ''); // Strip UTF-8 BOM if present

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentField += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentField += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (ch === '\r' && next === '\n') {
      currentRow.push(currentField.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      i += 1;
    } else if (ch === '\n' || ch === '\r') {
      currentRow.push(currentField.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += ch;
    }
  }

  currentRow.push(currentField.trim());
  if (currentRow.some((cell) => cell.length > 0)) {
    rows.push(currentRow);
  }

  return rows;
}

export interface CsvImportResult {
  ok: boolean;
  items: BoqLineItem[];
  errors: string[];
}

function parseNumericCell(raw: string): number | null {
  const cleaned = raw.replace(/[$€£¥,\s]/g, '').trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function parseBoqCsv(csvText: string): CsvImportResult {
  const matrix = parseCsvMatrix(csvText);
  if (matrix.length === 0) {
    return { ok: false, items: [], errors: ['CSV input is empty. Paste rows or upload a CSV file.'] };
  }

  // Detect header row automatically
  const firstRowLower = matrix[0].map((c) => c.toLowerCase());
  const looksLikeHeader =
    firstRowLower[0]?.includes('boq') ||
    firstRowLower[0]?.includes('code') ||
    firstRowLower[1]?.includes('item') ||
    firstRowLower[1]?.includes('description') ||
    firstRowLower[3]?.includes('qty') ||
    firstRowLower[3]?.includes('quantity');

  const dataRows = looksLikeHeader ? matrix.slice(1) : matrix;
  if (dataRows.length === 0) {
    return {
      ok: false,
      items: [],
      errors: ['CSV contains only a header row and no BOQ data rows.'],
    };
  }

  const items: BoqLineItem[] = [];
  const errors: string[] = [];

  dataRows.forEach((cols, idx) => {
    const lineNum = looksLikeHeader ? idx + 2 : idx + 1;
    if (cols.length < 5) {
      errors.push(
        `Row ${lineNum}: Expected at least 5 columns (BOQ Code, Item Description, Unit, Quantity, Benchmark Rate), got ${cols.length}.`
      );
      return;
    }

    const boqCode = cols[0];
    const itemName = cols[1];
    const unit = cols[2] || 'LS';
    const quantity = parseNumericCell(cols[3]);
    const benchmarkUnitRate = parseNumericCell(cols[4]);
    const rawA = cols[5] !== undefined ? parseNumericCell(cols[5]) : null;
    const rawB = cols[6] !== undefined ? parseNumericCell(cols[6]) : null;
    const rawC = cols[7] !== undefined ? parseNumericCell(cols[7]) : null;

    if (!boqCode) {
      errors.push(`Row ${lineNum}: Missing BOQ Code.`);
      return;
    }
    if (!itemName) {
      errors.push(`Row ${lineNum}: Missing Item Description for BOQ Code "${boqCode}".`);
      return;
    }
    if (quantity === null || Number.isNaN(quantity) || quantity <= 0) {
      errors.push(`Row ${lineNum}: Quantity must be a positive number for "${boqCode}".`);
      return;
    }
    if (benchmarkUnitRate === null || Number.isNaN(benchmarkUnitRate) || benchmarkUnitRate < 0) {
      errors.push(`Row ${lineNum}: Benchmark Rate must be a valid non-negative number for "${boqCode}".`);
      return;
    }
    if (Number.isNaN(rawA) || Number.isNaN(rawB) || Number.isNaN(rawC)) {
      errors.push(
        `Row ${lineNum}: Subcontractor unit rates must be numeric or left blank (for omissions) in "${boqCode}".`
      );
      return;
    }

    items.push({
      id: `boq-csv-${Date.now()}-${idx}`,
      boqCode,
      itemName,
      unit,
      quantity,
      benchmarkUnitRate,
      bidderARawRate: rawA !== null && rawA > 0 ? rawA : null,
      bidderBRawRate: rawB !== null && rawB > 0 ? rawB : null,
      bidderCRawRate: rawC !== null && rawC > 0 ? rawC : null,
    });
  });

  if (errors.length > 0) {
    return { ok: false, items: [], errors };
  }

  return { ok: true, items, errors: [] };
}

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportBoqToCsv(items: BoqLineItem[], params: GlobalParameters): string {
  const headers = [
    'BOQ Code',
    'Item Description',
    'Unit',
    'Quantity',
    'Internal Benchmark Rate',
    `${params.bidderAName} Raw Rate`,
    `${params.bidderBName} Raw Rate`,
    `${params.bidderCName} Raw Rate`,
  ];

  const lines = [headers.map(escapeCsvCell).join(',')];
  for (const item of items) {
    lines.push(
      [
        item.boqCode,
        item.itemName,
        item.unit,
        item.quantity,
        item.benchmarkUnitRate,
        item.bidderARawRate ?? '',
        item.bidderBRawRate ?? '',
        item.bidderCRawRate ?? '',
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }
  return lines.join('\n');
}

export function exportClarificationsToCsv(
  clarifications: ClarificationItem[],
  params: GlobalParameters
): string {
  const headers = [
    'BOQ Code',
    'Item Description',
    'Unit',
    'Quantity',
    'Benchmark Rate',
    `${params.bidderAName} Rate`,
    `${params.bidderAName} Deviation`,
    `${params.bidderAName} Flag`,
    `${params.bidderBName} Rate`,
    `${params.bidderBName} Deviation`,
    `${params.bidderBName} Flag`,
    `${params.bidderCName} Rate`,
    `${params.bidderCName} Deviation`,
    `${params.bidderCName} Flag`,
    'Clarification Directive',
  ];

  const lines = [headers.map(escapeCsvCell).join(',')];
  for (const item of clarifications) {
    lines.push(
      [
        item.boqCode,
        item.itemName,
        item.unit,
        formatNumber(item.quantity, 2),
        formatNumber(item.benchmarkUnitRate, 2),
        item.bidderARate > 0 ? formatNumber(item.bidderARate, 2) : 'Omitted',
        formatSignedPercent(item.bidderADeviationPct),
        item.bidderAFlag,
        item.bidderBRate > 0 ? formatNumber(item.bidderBRate, 2) : 'Omitted',
        formatSignedPercent(item.bidderBDeviationPct),
        item.bidderBFlag,
        item.bidderCRate > 0 ? formatNumber(item.bidderCRate, 2) : 'Omitted',
        formatSignedPercent(item.bidderCDeviationPct),
        item.bidderCFlag,
        item.clarificationDirective,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }
  return lines.join('\n');
}

export const SAMPLE_BOQ_CSV = `BOQ Code,Item Description,Unit,Quantity,Internal Benchmark Rate,Subcontractor A Raw Rate,Subcontractor B Raw Rate,Subcontractor C Raw Rate
011701001,"Stormwater Drainage Precast Culvert, DN600",m,420,115.00,,112.00,152.00
011802003,External Hardscape Granite Paving,m²,1100,74.00,71.50,73.00,76.50`;
