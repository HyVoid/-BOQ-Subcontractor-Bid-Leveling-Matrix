'use client';

import React, { useMemo, useState } from 'react';
import { Download, Plus, Search, Trash2, Upload } from 'lucide-react';
import type { BoqLineItem, GlobalParameters, WorkbookTotals } from '@/lib/types';
import { formatCurrency } from '@/lib/bid-leveling';

interface BoqInputViewProps {
  boqItems: BoqLineItem[];
  parameters: GlobalParameters;
  totals: WorkbookTotals;
  highlightedBoqCode: string | null;
  onUpdateItem: (id: string, patch: Partial<BoqLineItem>) => void;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
  onExportCsv: () => void;
  onOpenCsvImport: () => void;
}

function parsePositiveNumber(raw: string, fallback: number): number {
  const cleaned = raw.trim();
  if (!cleaned) return fallback;
  const num = Number(cleaned);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
}

function parseOptionalRateInput(raw: string): number | null {
  const cleaned = raw.trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

export function BoqInputView({
  boqItems,
  parameters,
  totals,
  highlightedBoqCode,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onExportCsv,
  onOpenCsvImport,
}: BoqInputViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const sym = parameters.currencySymbol || '$';

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return boqItems;
    return boqItems.filter(
      (item) =>
        item.boqCode.toLowerCase().includes(q) ||
        item.itemName.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q)
    );
  }, [boqItems, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tw-label-caps mb-1.5" style={{ color: 'var(--muted)' }}>
            Sheet 01 · Manual Input Zone
          </p>
          <h1 className="tw-page-title">Baseline BOQ &amp; Subcontractor Raw Bids</h1>
          <p className="mt-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
            Edit benchmark quantities and raw subcontractor unit rates directly. Leave any
            subcontractor rate blank to mark an omitted item for automatic plug-rate leveling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenCsvImport}
            className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Import BOQ CSV</span>
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            disabled={boqItems.length === 0}
            className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-2 whitespace-nowrap cursor-pointer disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export BOQ CSV</span>
          </button>
          <button
            type="button"
            onClick={onAddItem}
            className="tw-btn tw-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Add BOQ Item</span>
          </button>
        </div>
      </div>

      {/* Live Quick Totals & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by BOQ code, description, or unit..."
            aria-label="Filter BOQ line items"
            className="w-full py-2 pl-9 pr-3 text-[13px] focus:outline-none"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--brand)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-4 text-[12px] tabular-nums"
          style={{ color: 'var(--muted)' }}
        >
          <span>
            Items:{' '}
            <strong style={{ color: 'var(--brand)' }}>
              {filteredItems.length}
              {searchQuery ? ` / ${boqItems.length}` : ''}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Benchmark:{' '}
            <strong style={{ color: 'var(--brand)' }}>
              {formatCurrency(totals.benchmarkTotal, sym, 0)}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Raw A:{' '}
            <strong style={{ color: 'var(--brand)' }}>
              {formatCurrency(totals.rawTotalA, sym, 0)}
            </strong>
          </span>
          <span>
            Raw B:{' '}
            <strong style={{ color: 'var(--brand)' }}>
              {formatCurrency(totals.rawTotalB, sym, 0)}
            </strong>
          </span>
          <span>
            Raw C:{' '}
            <strong style={{ color: 'var(--brand)' }}>
              {formatCurrency(totals.rawTotalC, sym, 0)}
            </strong>
          </span>
        </div>
      </div>

      {/* Editable BOQ Grid */}
      {boqItems.length === 0 ? (
        <div className="tw-card p-12 text-center">
          <h2
            className="font-editorial text-[20px] font-semibold"
            style={{ color: 'var(--brand)' }}
          >
            No BOQ Line Items Entered
          </h2>
          <p className="mt-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
            Add your first BOQ line item manually or bulk-import a spreadsheet CSV to start bid
            leveling.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onAddItem}
              className="tw-btn tw-btn-primary inline-flex items-center gap-1.5 px-4 py-2 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add First BOQ Item</span>
            </button>
            <button
              type="button"
              onClick={onOpenCsvImport}
              className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-4 py-2 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Bulk CSV Import</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="tw-table-container">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="tw-table-head">
                <tr>
                  <th scope="col" className="text-left !px-2.5">BOQ Code</th>
                  <th scope="col" className="text-left !px-2.5">Item Description</th>
                  <th scope="col" className="text-left !px-2">Unit</th>
                  <th scope="col" className="text-right !px-2">Qty</th>
                  <th scope="col" className="text-right !px-2">Bench. ({sym})</th>
                  <th
                    scope="col"
                    className="text-right !px-2"
                    title={parameters.bidderAName}
                  >
                    Sub. A ({sym})
                  </th>
                  <th
                    scope="col"
                    className="text-right !px-2"
                    title={parameters.bidderBName}
                  >
                    Sub. B ({sym})
                  </th>
                  <th
                    scope="col"
                    className="text-right !px-2"
                    title={parameters.bidderCName}
                  >
                    Sub. C ({sym})
                  </th>
                  <th scope="col" className="text-right !px-2.5">Del</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isHighlighted =
                    highlightedBoqCode !== null && item.boqCode === highlightedBoqCode;
                  return (
                    <tr
                      key={item.id}
                      className="tw-table-row"
                      style={
                        isHighlighted
                          ? { backgroundColor: 'var(--accent-soft)' }
                          : undefined
                      }
                    >
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="text"
                          value={item.boqCode}
                          onChange={(e) =>
                            onUpdateItem(item.id, { boqCode: e.target.value })
                          }
                          aria-label={`BOQ Code for ${item.itemName || item.id}`}
                          className="tw-input w-24 px-2 py-1.5 tabular-nums font-medium"
                        />
                      </td>
                      <td className="px-2 py-2 align-middle min-w-[260px]">
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) =>
                            onUpdateItem(item.id, { itemName: e.target.value })
                          }
                          aria-label={`Item Description for ${item.boqCode}`}
                          className="tw-input w-full px-2.5 py-1.5"
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) =>
                            onUpdateItem(item.id, { unit: e.target.value })
                          }
                          aria-label={`Unit for ${item.boqCode}`}
                          className="tw-input w-14 px-2 py-1.5"
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              quantity: parsePositiveNumber(e.target.value, 0),
                            })
                          }
                          aria-label={`Quantity for ${item.boqCode}`}
                          className="tw-input w-20 px-2 py-1.5 text-right tabular-nums"
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.benchmarkUnitRate}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              benchmarkUnitRate: parsePositiveNumber(e.target.value, 0),
                            })
                          }
                          aria-label={`Benchmark Rate for ${item.boqCode}`}
                          className="tw-input w-24 px-2 py-1.5 text-right tabular-nums font-medium"
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.bidderARawRate ?? ''}
                          placeholder="Omitted"
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              bidderARawRate: parseOptionalRateInput(e.target.value),
                            })
                          }
                          aria-label={`Subcontractor A raw rate for ${item.boqCode}`}
                          className="tw-input w-24 px-2 py-1.5 text-right tabular-nums"
                          style={
                            item.bidderARawRate === null
                              ? { borderColor: 'var(--danger)' }
                              : undefined
                          }
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.bidderBRawRate ?? ''}
                          placeholder="Omitted"
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              bidderBRawRate: parseOptionalRateInput(e.target.value),
                            })
                          }
                          aria-label={`Subcontractor B raw rate for ${item.boqCode}`}
                          className="tw-input w-24 px-2 py-1.5 text-right tabular-nums"
                          style={
                            item.bidderBRawRate === null
                              ? { borderColor: 'var(--danger)' }
                              : undefined
                          }
                        />
                      </td>
                      <td className="px-2 py-2 align-middle">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.bidderCRawRate ?? ''}
                          placeholder="Omitted"
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              bidderCRawRate: parseOptionalRateInput(e.target.value),
                            })
                          }
                          aria-label={`Subcontractor C raw rate for ${item.boqCode}`}
                          className="tw-input w-24 px-2 py-1.5 text-right tabular-nums"
                          style={
                            item.bidderCRawRate === null
                              ? { borderColor: 'var(--danger)' }
                              : undefined
                          }
                        />
                      </td>
                      <td className="px-2 py-2 align-middle text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          aria-label={`Delete BOQ item ${item.boqCode} ${item.itemName}`}
                          className="p-1.5 cursor-pointer transition-colors"
                          style={{ color: 'var(--muted)' }}
                          title={`Delete ${item.boqCode}`}
                        >
                          <Trash2 className="h-4 w-4 hover:opacity-80" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-[13px]" style={{ color: 'var(--muted)' }}>
              No BOQ items match &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      )}

      {/* Legend note */}
      <div className="tw-insight-block px-4 py-3 text-[12px]" style={{ color: 'var(--brand)' }}>
        <strong>Input Discipline:</strong> Yellow cells indicate editable user inputs. Blank
        subcontractor rate cells (outlined in red) represent scope omissions and are automatically
        leveled in Sheet 02 using{' '}
        <strong>{parameters.plugRateMode}</strong>
        {parameters.penaltyUpliftPct !== 0
          ? ` plus a ${parameters.penaltyUpliftPct}% omission penalty uplift`
          : ''}
        .
      </div>
    </div>
  );
}
