'use client';

import React from 'react';
import type { GlobalParameters, PlugRateMode } from '@/lib/types';

interface ParametersViewProps {
  parameters: GlobalParameters;
  onUpdateParameters: (patch: Partial<GlobalParameters>) => void;
}

function parseNumberField(raw: string, fallback: number): number {
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

export function ParametersView({
  parameters,
  onUpdateParameters,
}: ParametersViewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="tw-label-caps mb-1.5" style={{ color: 'var(--muted)' }}>
          Sheet 00 · Global Control Layer
        </p>
        <h1 className="tw-page-title">Global Parameters &amp; Evaluation Rules</h1>
        <p className="mt-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
          Single-point configuration for currency formatting, omission plug-rate rules, unbalanced
          pricing thresholds, and subcontractor labels. Changes recalculate Sheets 02 and 03
          instantly.
        </p>
      </div>

      {/* Parameter Key-Value Table (P01 - P08) */}
      <div className="tw-table-container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="tw-table-head">
              <tr>
                <th scope="col" className="text-left">Code</th>
                <th scope="col" className="text-left">Parameter Name</th>
                <th scope="col" className="text-left">Configured Value</th>
                <th scope="col" className="text-left">Format / Valid Range</th>
                <th scope="col" className="text-left">Business Logic &amp; Downstream Impact</th>
              </tr>
            </thead>
            <tbody>
              {/* P01 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P01
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-currency">Base Currency Symbol</label>
                </td>
                <td className="px-3.5 py-3">
                  <input
                    id="param-currency"
                    type="text"
                    maxLength={6}
                    value={parameters.currencySymbol}
                    onChange={(e) =>
                      onUpdateParameters({ currencySymbol: e.target.value })
                    }
                    className="tw-input w-36 px-2.5 py-1.5 font-medium"
                  />
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Text (e.g., $, €, £, ¥)
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Formats all monetary unit rates, plug amounts, and leveled total labels across
                  Sheets 01–03.
                </td>
              </tr>

              {/* P02 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P02
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-plug-mode">Omission Plug Rate Mode</label>
                </td>
                <td className="px-3.5 py-3">
                  <select
                    id="param-plug-mode"
                    value={parameters.plugRateMode}
                    onChange={(e) =>
                      onUpdateParameters({
                        plugRateMode: e.target.value as PlugRateMode,
                      })
                    }
                    className="tw-input w-56 px-2.5 py-1.5 font-medium cursor-pointer"
                  >
                    <option value="Benchmark Rate">Benchmark Rate</option>
                    <option value="Peer Average Rate">Peer Average Rate</option>
                  </select>
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Dropdown (Benchmark / Peer Avg)
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Controls the baseline rate plugged into omitted subcontractor items in Sheet 02
                  (falls back to Benchmark Rate if all bidders omit an item).
                </td>
              </tr>

              {/* P03 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P03
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-penalty">Omission Penalty Uplift (%)</label>
                </td>
                <td className="px-3.5 py-3">
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      id="param-penalty"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={parameters.penaltyUpliftPct}
                      onChange={(e) =>
                        onUpdateParameters({
                          penaltyUpliftPct: Math.max(
                            0,
                            parseNumberField(e.target.value, 0)
                          ),
                        })
                      }
                      className="tw-input w-28 px-2.5 py-1.5 text-right tabular-nums font-medium"
                    />
                    <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                      %
                    </span>
                  </div>
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Percentage (0.0% – 100.0%)
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Optional punitive markup applied on top of the plug rate for omitted scope
                  items (0.0% applies exact baseline rate).
                </td>
              </tr>

              {/* P04 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P04
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-unbalanced">Unbalanced Bid Red-Flag Threshold (%)</label>
                </td>
                <td className="px-3.5 py-3">
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      id="param-unbalanced"
                      type="number"
                      step="1"
                      min="0"
                      max="200"
                      value={parameters.unbalancedThresholdPct}
                      onChange={(e) =>
                        onUpdateParameters({
                          unbalancedThresholdPct: Math.max(
                            0,
                            parseNumberField(e.target.value, 25)
                          ),
                        })
                      }
                      className="tw-input w-28 px-2.5 py-1.5 text-right tabular-nums font-medium"
                    />
                    <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                      %
                    </span>
                  </div>
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Percentage (Default 25.0%)
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Triggers a Red Flag in Sheet 02 and auto-populates Sheet 03&apos;s Clarification
                  List whenever a submitted rate exceeds benchmark by more than this percentage.
                </td>
              </tr>

              {/* P05 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P05
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-overrun">Budget Overrun Alert Threshold (%)</label>
                </td>
                <td className="px-3.5 py-3">
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      id="param-overrun"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={parameters.budgetOverrunThresholdPct}
                      onChange={(e) =>
                        onUpdateParameters({
                          budgetOverrunThresholdPct: Math.max(
                            0,
                            parseNumberField(e.target.value, 5)
                          ),
                        })
                      }
                      className="tw-input w-28 px-2.5 py-1.5 text-right tabular-nums font-medium"
                    />
                    <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
                      %
                    </span>
                  </div>
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Percentage (Default 5.0%)
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Flags a subcontractor&apos;s Award Verdict as &ldquo;Over Budget Alert&rdquo; in
                  Sheet 03 when their leveled total exceeds internal benchmark beyond this tolerance.
                </td>
              </tr>

              {/* P06 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P06
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-bidder-a">Subcontractor A Display Name</label>
                </td>
                <td className="px-3.5 py-3">
                  <input
                    id="param-bidder-a"
                    type="text"
                    value={parameters.bidderAName}
                    onChange={(e) =>
                      onUpdateParameters({ bidderAName: e.target.value })
                    }
                    className="tw-input w-64 px-2.5 py-1.5"
                  />
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Text
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Synchronizes Subcontractor A&apos;s legal name across headers, rankings, and
                  clarification directives.
                </td>
              </tr>

              {/* P07 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P07
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-bidder-b">Subcontractor B Display Name</label>
                </td>
                <td className="px-3.5 py-3">
                  <input
                    id="param-bidder-b"
                    type="text"
                    value={parameters.bidderBName}
                    onChange={(e) =>
                      onUpdateParameters({ bidderBName: e.target.value })
                    }
                    className="tw-input w-64 px-2.5 py-1.5"
                  />
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Text
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Synchronizes Subcontractor B&apos;s legal name across headers, rankings, and
                  clarification directives.
                </td>
              </tr>

              {/* P08 */}
              <tr className="tw-table-row">
                <td className="px-3.5 py-3 tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                  P08
                </td>
                <td className="px-3.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                  <label htmlFor="param-bidder-c">Subcontractor C Display Name</label>
                </td>
                <td className="px-3.5 py-3">
                  <input
                    id="param-bidder-c"
                    type="text"
                    value={parameters.bidderCName}
                    onChange={(e) =>
                      onUpdateParameters({ bidderCName: e.target.value })
                    }
                    className="tw-input w-64 px-2.5 py-1.5"
                  />
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--muted)' }}>
                  Text
                </td>
                <td className="px-3.5 py-3 text-[12px]" style={{ color: 'var(--body-text)' }}>
                  Synchronizes Subcontractor C&apos;s legal name across headers, rankings, and
                  clarification directives.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Formula Reference Block */}
      <div className="tw-insight-block px-5 py-4">
        <h2
          className="font-editorial text-[17px] font-semibold tracking-[-0.02em] mb-1"
          style={{ color: 'var(--brand)' }}
        >
          Active Leveling Formula Summary
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--body-text)' }}>
          For any omitted BOQ line item, the engine assigns{' '}
          <strong>
            Plug Rate = {parameters.plugRateMode} × (1 + {parameters.penaltyUpliftPct.toFixed(1)}%)
          </strong>
          . Any quoted rate where{' '}
          <strong>
            (Bidder Rate − Benchmark Rate) / Benchmark Rate &gt; +
            {parameters.unbalancedThresholdPct.toFixed(1)}%
          </strong>{' '}
          is flagged as an unbalanced pricing anomaly for pre-award clarification.
        </p>
      </div>
    </div>
  );
}
