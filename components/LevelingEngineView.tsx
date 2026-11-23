'use client';

import React, { useMemo, useState } from 'react';
import { Lock, Search } from 'lucide-react';
import type {
  GlobalParameters,
  RedFlagStatus,
  WorkbookCalculationResult,
} from '@/lib/types';
import {
  formatCurrency,
  formatNumber,
  formatSignedPercent,
} from '@/lib/bid-leveling';
import { StatusPill, type PillTone } from './StatusPill';

type ColumnLens = 'all' | 'rates' | 'totals' | 'deviations';

interface LevelingEngineViewProps {
  result: WorkbookCalculationResult;
  parameters: GlobalParameters;
  highlightedBoqCode: string | null;
  onJumpToInput: (boqCode: string) => void;
}

function flagTone(status: RedFlagStatus): PillTone {
  if (status === 'Red Flag') return 'danger';
  if (status === 'Omitted (Plugged)') return 'accent';
  return 'neutral';
}

export function LevelingEngineView({
  result,
  parameters,
  highlightedBoqCode,
  onJumpToInput,
}: LevelingEngineViewProps) {
  const [lens, setLens] = useState<ColumnLens>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const sym = parameters.currencySymbol || '$';

  const { leveledRows, totals } = result;

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return leveledRows;
    return leveledRows.filter(
      (r) =>
        r.boqCode.toLowerCase().includes(q) ||
        r.itemName.toLowerCase().includes(q)
    );
  }, [leveledRows, searchQuery]);

  const showRates = lens === 'all' || lens === 'rates';
  const showTotals = lens === 'all' || lens === 'totals';
  const showDeviations = lens === 'all' || lens === 'deviations';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tw-label-caps mb-1.5" style={{ color: 'var(--muted)' }}>
            Sheet 02 · Formula-Generated Engine (Read-Only)
          </p>
          <h1 className="tw-page-title">Omission Plug-Rate &amp; Deviation Engine</h1>
          <p className="mt-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
            Live-computed 27-column workbook engine (8 mirrored inputs + 19 calculated columns).
            Active mode: <strong>{parameters.plugRateMode}</strong> · Uplift:{' '}
            <strong>{formatNumber(parameters.penaltyUpliftPct, 1)}%</strong> · Red-flag
            threshold: <strong>+{formatNumber(parameters.unbalancedThresholdPct, 1)}%</strong>.
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px]"
          style={{
            backgroundColor: 'var(--calc-bg)',
            color: 'var(--muted)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Formula-locked · Auto-recalculates from Sheets 00 &amp; 01</span>
        </div>
      </div>

      {/* Controls: Column Lens & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex flex-wrap items-center p-0.5"
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
          }}
          role="group"
          aria-label="Select calculation column view"
        >
          {(
            [
              { id: 'all', label: 'All 27 Columns' },
              { id: 'rates', label: 'Plug & Leveled Rates' },
              { id: 'totals', label: 'Omissions & Totals' },
              { id: 'deviations', label: 'Deviations & Flags' },
            ] as const
          ).map((item) => {
            const active = lens === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLens(item.id)}
                className="px-3 py-1.5 text-[12px] font-medium whitespace-nowrap cursor-pointer transition-colors"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: active ? 'var(--brand)' : 'transparent',
                  color: active ? 'var(--surface)' : 'var(--muted)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calculated rows..."
            aria-label="Search leveling calculation rows"
            className="w-full py-1.5 pl-9 pr-3 text-[13px] focus:outline-none"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--brand)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>
      </div>

      {/* Formula Table */}
      {leveledRows.length === 0 ? (
        <div className="tw-card p-10 text-center">
          <p
            className="font-editorial text-[19px] font-semibold"
            style={{ color: 'var(--brand)' }}
          >
            No Rows to Calculate
          </p>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--muted)' }}>
            Enter BOQ line items in Sheet 01 to populate the dynamic leveling calculation engine.
          </p>
        </div>
      ) : (
        <div className="tw-table-container">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="tw-table-head">
                <tr>
                  <th scope="col" className="text-left">BOQ Code</th>
                  <th scope="col" className="text-left">Item Description</th>
                  <th scope="col" className="text-left">Unit</th>
                  <th scope="col" className="text-right">Qty</th>
                  <th scope="col" className="text-right">Bench. Rate</th>

                  {showRates && (
                    <>
                      <th scope="col" className="text-right">Raw A</th>
                      <th scope="col" className="text-right">Raw B</th>
                      <th scope="col" className="text-right">Raw C</th>
                      <th scope="col" className="text-right">Peer Avg</th>
                      <th scope="col" className="text-right">Plug Rate</th>
                      <th scope="col" className="text-right">Leveled A</th>
                      <th scope="col" className="text-right">Leveled B</th>
                      <th scope="col" className="text-right">Leveled C</th>
                    </>
                  )}

                  {showTotals && (
                    <>
                      <th scope="col" className="text-right">Bench. Total</th>
                      <th scope="col" className="text-right">Plug Amt A</th>
                      <th scope="col" className="text-right">Plug Amt B</th>
                      <th scope="col" className="text-right">Plug Amt C</th>
                      <th scope="col" className="text-right">Leveled Total A</th>
                      <th scope="col" className="text-right">Leveled Total B</th>
                      <th scope="col" className="text-right">Leveled Total C</th>
                    </>
                  )}

                  {showDeviations && (
                    <>
                      <th scope="col" className="text-right">Dev. A</th>
                      <th scope="col" className="text-right">Dev. B</th>
                      <th scope="col" className="text-right">Dev. C</th>
                      <th scope="col" className="text-left">Status A</th>
                      <th scope="col" className="text-left">Status B</th>
                      <th scope="col" className="text-left">Status C</th>
                      <th scope="col" className="text-left">Clarify?</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const isHighlighted =
                    highlightedBoqCode !== null && row.boqCode === highlightedBoqCode;
                  return (
                    <tr
                      key={row.id}
                      className={`tw-table-row tw-table-row-calc ${
                        row.triggersClarification ? 'tw-table-row-anomaly' : ''
                      }`}
                      style={
                        isHighlighted
                          ? { outline: '2px solid var(--accent)', outlineOffset: '-2px' }
                          : undefined
                      }
                    >
                      <td className="px-3.5 py-2.5 tabular-nums font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onJumpToInput(row.boqCode)}
                          className="underline-offset-2 hover:underline cursor-pointer"
                          style={{ color: 'var(--accent)' }}
                          title={`Edit ${row.boqCode} in Sheet 01`}
                        >
                          {row.boqCode}
                        </button>
                      </td>
                      <td
                        className="px-3.5 py-2.5 min-w-[200px] font-medium"
                        style={{ color: 'var(--brand)' }}
                      >
                        {row.itemName}
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">{row.unit}</td>
                      <td className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap">
                        {formatNumber(row.quantity, 2)}
                      </td>
                      <td className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap">
                        {formatCurrency(row.benchmarkUnitRate, sym, 2)}
                      </td>

                      {showRates && (
                        <>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color: row.bidderAOmitted ? 'var(--danger)' : 'var(--body-text)',
                            }}
                          >
                            {row.bidderAOmitted
                              ? `${sym}0.00`
                              : formatCurrency(row.bidderARawRate, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color: row.bidderBOmitted ? 'var(--danger)' : 'var(--body-text)',
                            }}
                          >
                            {row.bidderBOmitted
                              ? `${sym}0.00`
                              : formatCurrency(row.bidderBRawRate, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color: row.bidderCOmitted ? 'var(--danger)' : 'var(--body-text)',
                            }}
                          >
                            {row.bidderCOmitted
                              ? `${sym}0.00`
                              : formatCurrency(row.bidderCRawRate, sym, 2)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap">
                            {formatCurrency(row.peerAverageRate, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums font-semibold whitespace-nowrap"
                            style={{ color: 'var(--accent)' }}
                          >
                            {formatCurrency(row.plugStandardRate, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color: row.bidderAOmitted ? 'var(--accent)' : 'var(--body-text)',
                              fontWeight: row.bidderAOmitted ? 600 : 400,
                            }}
                          >
                            {formatCurrency(row.leveledRateA, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color: row.bidderBOmitted ? 'var(--accent)' : 'var(--body-text)',
                              fontWeight: row.bidderBOmitted ? 600 : 400,
                            }}
                          >
                            {formatCurrency(row.leveledRateB, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color: row.bidderCOmitted ? 'var(--accent)' : 'var(--body-text)',
                              fontWeight: row.bidderCOmitted ? 600 : 400,
                            }}
                          >
                            {formatCurrency(row.leveledRateC, sym, 2)}
                          </td>
                        </>
                      )}

                      {showTotals && (
                        <>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-medium whitespace-nowrap">
                            {formatCurrency(row.benchmarkTotal, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color:
                                row.omissionPlugAmountA > 0 ? 'var(--danger)' : 'var(--muted)',
                              fontWeight: row.omissionPlugAmountA > 0 ? 600 : 400,
                            }}
                          >
                            {formatCurrency(row.omissionPlugAmountA, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color:
                                row.omissionPlugAmountB > 0 ? 'var(--danger)' : 'var(--muted)',
                              fontWeight: row.omissionPlugAmountB > 0 ? 600 : 400,
                            }}
                          >
                            {formatCurrency(row.omissionPlugAmountB, sym, 2)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color:
                                row.omissionPlugAmountC > 0 ? 'var(--danger)' : 'var(--muted)',
                              fontWeight: row.omissionPlugAmountC > 0 ? 600 : 400,
                            }}
                          >
                            {formatCurrency(row.omissionPlugAmountC, sym, 2)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-medium whitespace-nowrap">
                            {formatCurrency(row.leveledTotalA, sym, 2)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-medium whitespace-nowrap">
                            {formatCurrency(row.leveledTotalB, sym, 2)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right tabular-nums font-medium whitespace-nowrap">
                            {formatCurrency(row.leveledTotalC, sym, 2)}
                          </td>
                        </>
                      )}

                      {showDeviations && (
                        <>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color:
                                row.redFlagStatusA === 'Red Flag'
                                  ? 'var(--danger)'
                                  : 'var(--body-text)',
                              fontWeight: row.redFlagStatusA === 'Red Flag' ? 600 : 400,
                            }}
                          >
                            {row.bidderAOmitted
                              ? 'Omitted'
                              : formatSignedPercent(row.deviationPctA, 1)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color:
                                row.redFlagStatusB === 'Red Flag'
                                  ? 'var(--danger)'
                                  : 'var(--body-text)',
                              fontWeight: row.redFlagStatusB === 'Red Flag' ? 600 : 400,
                            }}
                          >
                            {row.bidderBOmitted
                              ? 'Omitted'
                              : formatSignedPercent(row.deviationPctB, 1)}
                          </td>
                          <td
                            className="px-3.5 py-2.5 text-right tabular-nums whitespace-nowrap"
                            style={{
                              color:
                                row.redFlagStatusC === 'Red Flag'
                                  ? 'var(--danger)'
                                  : 'var(--body-text)',
                              fontWeight: row.redFlagStatusC === 'Red Flag' ? 600 : 400,
                            }}
                          >
                            {row.bidderCOmitted
                              ? 'Omitted'
                              : formatSignedPercent(row.deviationPctC, 1)}
                          </td>
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <StatusPill
                              label={row.redFlagStatusA}
                              tone={flagTone(row.redFlagStatusA)}
                              onClick={() => onJumpToInput(row.boqCode)}
                              ariaLabel={`Edit ${row.boqCode} Subcontractor A: ${row.redFlagStatusA}`}
                            />
                          </td>
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <StatusPill
                              label={row.redFlagStatusB}
                              tone={flagTone(row.redFlagStatusB)}
                              onClick={() => onJumpToInput(row.boqCode)}
                              ariaLabel={`Edit ${row.boqCode} Subcontractor B: ${row.redFlagStatusB}`}
                            />
                          </td>
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <StatusPill
                              label={row.redFlagStatusC}
                              tone={flagTone(row.redFlagStatusC)}
                              onClick={() => onJumpToInput(row.boqCode)}
                              ariaLabel={`Edit ${row.boqCode} Subcontractor C: ${row.redFlagStatusC}`}
                            />
                          </td>
                          <td className="px-3.5 py-2.5 whitespace-nowrap">
                            <StatusPill
                              label={row.triggersClarification ? 'Yes' : 'No'}
                              tone={row.triggersClarification ? 'danger' : 'neutral'}
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    backgroundColor: 'var(--table-header-bg)',
                    borderTop: '2px solid var(--table-header-sep)',
                    color: 'var(--brand)',
                  }}
                >
                  <td colSpan={5} className="px-3.5 py-3 font-semibold">
                    Workbook Totals ({totals.itemCount} Items)
                  </td>
                  {showRates && <td colSpan={8} className="px-3.5 py-3 text-right text-[12px]" style={{ color: 'var(--muted)' }}>Unit rates aggregated in Totals lens</td>}
                  {showTotals && (
                    <>
                      <td className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap">
                        {formatCurrency(totals.benchmarkTotal, sym, 2)}
                      </td>
                      <td
                        className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap"
                        style={{ color: totals.omissionPlugTotalA > 0 ? 'var(--danger)' : 'var(--brand)' }}
                      >
                        {formatCurrency(totals.omissionPlugTotalA, sym, 2)}
                      </td>
                      <td
                        className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap"
                        style={{ color: totals.omissionPlugTotalB > 0 ? 'var(--danger)' : 'var(--brand)' }}
                      >
                        {formatCurrency(totals.omissionPlugTotalB, sym, 2)}
                      </td>
                      <td
                        className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap"
                        style={{ color: totals.omissionPlugTotalC > 0 ? 'var(--danger)' : 'var(--brand)' }}
                      >
                        {formatCurrency(totals.omissionPlugTotalC, sym, 2)}
                      </td>
                      <td className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap">
                        {formatCurrency(totals.leveledTotalA, sym, 2)}
                      </td>
                      <td className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap">
                        {formatCurrency(totals.leveledTotalB, sym, 2)}
                      </td>
                      <td className="px-3.5 py-3 text-right tabular-nums font-semibold whitespace-nowrap">
                        {formatCurrency(totals.leveledTotalC, sym, 2)}
                      </td>
                    </>
                  )}
                  {showDeviations && (
                    <>
                      <td colSpan={3} className="px-3.5 py-3 text-right text-[12px]" style={{ color: 'var(--muted)' }}>
                        Red-Flag Counts:
                      </td>
                      <td className="px-3.5 py-3 tabular-nums font-semibold whitespace-nowrap">
                        A: {totals.redFlagCountA}
                      </td>
                      <td className="px-3.5 py-3 tabular-nums font-semibold whitespace-nowrap">
                        B: {totals.redFlagCountB}
                      </td>
                      <td className="px-3.5 py-3 tabular-nums font-semibold whitespace-nowrap">
                        C: {totals.redFlagCountC}
                      </td>
                      <td
                        className="px-3.5 py-3 tabular-nums font-semibold whitespace-nowrap"
                        style={{ color: totals.clarificationItemCount > 0 ? 'var(--danger)' : 'var(--brand)' }}
                      >
                        {totals.clarificationItemCount} Flagged
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
