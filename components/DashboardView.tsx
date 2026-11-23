'use client';

import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type {
  BidderKey,
  GlobalParameters,
  RedFlagStatus,
  WorkbookCalculationResult,
} from '@/lib/types';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from '@/lib/bid-leveling';
import { DataBar } from './DataBar';
import { StatusPill, type PillTone } from './StatusPill';

interface DashboardViewProps {
  result: WorkbookCalculationResult;
  parameters: GlobalParameters;
  onExportClarificationsCsv: () => void;
  onInspectBoqItem: (boqCode: string, target: 'boq-input' | 'leveling-engine') => void;
}

function redFlagTone(status: RedFlagStatus): PillTone {
  if (status === 'Red Flag') return 'danger';
  if (status === 'Omitted (Plugged)') return 'accent';
  return 'neutral';
}

export function DashboardView({
  result,
  parameters,
  onExportClarificationsCsv,
  onInspectBoqItem,
}: DashboardViewProps) {
  const [bidderFilter, setBidderFilter] = useState<'ALL' | BidderKey>('ALL');
  const sym = parameters.currencySymbol || '$';

  const { bidderSummaries, clarifications, totals, insight } = result;

  const trueLowestBidder = useMemo(
    () => bidderSummaries.find((b) => b.leveledRank === 1) ?? bidderSummaries[0],
    [bidderSummaries]
  );

  const highestOmissionBidder = useMemo(() => {
    return [...bidderSummaries].sort(
      (a, b) => b.omissionPlugTotal - a.omissionPlugTotal
    )[0];
  }, [bidderSummaries]);

  const maxLeveledTotal = useMemo(
    () => Math.max(totals.benchmarkTotal, ...bidderSummaries.map((b) => b.leveledTotal), 1),
    [bidderSummaries, totals.benchmarkTotal]
  );

  const maxOmissionTotal = useMemo(
    () => Math.max(...bidderSummaries.map((b) => b.omissionPlugTotal), 1),
    [bidderSummaries]
  );

  const filteredClarifications = useMemo(() => {
    if (bidderFilter === 'ALL') return clarifications;
    return clarifications.filter((item) => item.flaggedBidders.includes(bidderFilter));
  }, [clarifications, bidderFilter]);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tw-label-caps mb-1.5" style={{ color: 'var(--muted)' }}>
            Sheet 03 · Decision Dashboard
          </p>
          <h1 className="tw-page-title">Bid Leveling Dashboard &amp; Clarifications</h1>
          <p className="mt-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
            Equalized total bid ranking, omission plug exposure ({parameters.plugRateMode},{' '}
            {formatSignedPercent(parameters.penaltyUpliftPct)} uplift), and unbalanced unit-rate
            queries (&gt;+{formatNumber(parameters.unbalancedThresholdPct, 1)}% vs. benchmark).
          </p>
        </div>
      </div>

      {/* KPI Row — 4 Hero Metrics */}
      <section aria-label="Key evaluation metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* KPI 1: Internal Benchmark Total */}
          <div className="tw-card tw-card-hover p-5">
            <p className="tw-label-caps" style={{ color: 'var(--muted)' }}>
              Internal Benchmark Total
            </p>
            <p className="tw-kpi-value mt-2">
              {formatCurrency(totals.benchmarkTotal, sym, 0)}
            </p>
            <p className="mt-2 text-[12px]" style={{ color: 'var(--muted)' }}>
              {totals.itemCount} BOQ line item{totals.itemCount === 1 ? '' : 's'} · Baseline target
            </p>
          </div>

          {/* KPI 2: True Lowest Leveled Bid */}
          <div className="tw-card tw-card-hover p-5">
            <p className="tw-label-caps" style={{ color: 'var(--muted)' }}>
              True Lowest Leveled Bid
            </p>
            <p className="tw-kpi-value mt-2" style={{ color: 'var(--accent)' }}>
              {totals.itemCount > 0
                ? formatCurrency(trueLowestBidder.leveledTotal, sym, 0)
                : formatCurrency(0, sym, 0)}
            </p>
            <p className="mt-2 text-[12px] leading-snug" style={{ color: 'var(--muted)' }}>
              {totals.itemCount > 0
                ? `${trueLowestBidder.bidderName} · ${formatSignedPercent(
                    trueLowestBidder.varianceVsBenchmarkPct
                  )} vs. benchmark`
                : 'Awaiting BOQ entries'}
            </p>
          </div>

          {/* KPI 3: Highest Omission Exposure */}
          <div className="tw-card tw-card-hover p-5">
            <p className="tw-label-caps" style={{ color: 'var(--muted)' }}>
              Highest Omission Exposure
            </p>
            <p
              className="tw-kpi-value mt-2"
              style={{
                color:
                  highestOmissionBidder && highestOmissionBidder.omissionPlugTotal > 0
                    ? 'var(--danger)'
                    : 'var(--brand)',
              }}
            >
              {highestOmissionBidder
                ? formatCurrency(highestOmissionBidder.omissionPlugTotal, sym, 0)
                : formatCurrency(0, sym, 0)}
            </p>
            <p
              className="mt-2 text-[12px] truncate"
              style={{
                color:
                  highestOmissionBidder && highestOmissionBidder.isFalseLowBid
                    ? 'var(--danger)'
                    : 'var(--muted)',
                fontWeight:
                  highestOmissionBidder && highestOmissionBidder.isFalseLowBid ? 500 : 400,
              }}
            >
              {highestOmissionBidder && highestOmissionBidder.omittedCount > 0
                ? `${highestOmissionBidder.bidderName} · ${highestOmissionBidder.omittedCount} omitted item${
                    highestOmissionBidder.omittedCount === 1 ? '' : 's'
                  }`
                : 'Zero omitted items across bidders'}
            </p>
          </div>

          {/* KPI 4: Unbalanced Red-Flag Items */}
          <div className="tw-card tw-card-hover p-5">
            <p className="tw-label-caps" style={{ color: 'var(--muted)' }}>
              Unbalanced Red-Flag Items
            </p>
            <p
              className="tw-kpi-value mt-2"
              style={{
                color: totals.clarificationItemCount > 0 ? 'var(--danger)' : 'var(--brand)',
              }}
            >
              {totals.clarificationItemCount}
            </p>
            <p
              className="mt-2 text-[12px]"
              style={{
                color: totals.clarificationItemCount > 0 ? 'var(--danger)' : 'var(--muted)',
                fontWeight: totals.clarificationItemCount > 0 ? 500 : 400,
              }}
            >
              {totals.clarificationItemCount > 0
                ? `Requires clarification (>${formatNumber(parameters.unbalancedThresholdPct, 1)}% above benchmark)`
                : `All rates within +${formatNumber(parameters.unbalancedThresholdPct, 1)}% threshold`}
            </p>
          </div>
        </div>
      </section>

      {/* Executive Insight / Recommendation Block */}
      <section aria-label="Executive evaluation insight">
        <div className="tw-insight-block px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2
              className="font-editorial text-[17px] font-semibold tracking-[-0.02em]"
              style={{ color: 'var(--brand)' }}
            >
              {insight.headline}
            </h2>
            {insight.hasFalseLowBid && (
              <StatusPill label="False Low Bid Detected" tone="danger" />
            )}
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--body-text)' }}>
            {insight.summary}
          </p>
        </div>
      </section>

      {/* Upper Zone: Equalized Bid Ranking & Omission Summary Table (All 13 Workbook Fields) */}
      <section aria-label="Equalized bid ranking and omission summary">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="tw-section-title">
            1. Equalized Total Bid Ranking &amp; Omission Exposure
          </h2>
          <span className="text-[12px]" style={{ color: 'var(--muted)' }}>
            Click a bidder&apos;s Red Flags count to filter clarifications below
          </span>
        </div>

        <div className="tw-table-container">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="tw-table-head">
                <tr>
                  <th scope="col" className="text-left !px-2.5">Code</th>
                  <th scope="col" className="text-left !px-2.5">Subcontractor</th>
                  <th scope="col" className="text-right !px-2.5">Raw Total</th>
                  <th scope="col" className="text-right !px-2">Raw Rank</th>
                  <th scope="col" className="text-right !px-2">Omitted</th>
                  <th scope="col" className="text-right !px-2.5">Plug Total</th>
                  <th scope="col" className="text-right !px-2">Plug %</th>
                  <th scope="col" className="text-right !px-2.5">Leveled Total</th>
                  <th scope="col" className="text-right !px-2">True Rank</th>
                  <th scope="col" className="text-right !px-2">Red Flags</th>
                  <th scope="col" className="text-right !px-2.5">Vs. Bench.</th>
                  <th scope="col" className="text-left !px-2.5">Award Verdict</th>
                </tr>
              </thead>
              <tbody>
                {bidderSummaries.map((bidder) => {
                  const isAnomalyRow = bidder.isFalseLowBid || bidder.isOverBudget;
                  return (
                    <tr
                      key={bidder.bidderCode}
                      className={`tw-table-row ${
                        isAnomalyRow ? 'tw-table-row-anomaly' : ''
                      }`}
                    >
                      <td
                        className="px-2.5 py-3 font-semibold tabular-nums"
                        style={{ color: 'var(--brand)' }}
                      >
                        {bidder.bidderCode}
                      </td>
                      <td className="px-2.5 py-3 font-medium whitespace-nowrap" style={{ color: 'var(--brand)' }}>
                        <div>{bidder.bidderName}</div>
                        <div className="text-[11px] tabular-nums" style={{ color: 'var(--muted)' }}>
                          {bidder.currencyDisplayLabel}
                        </div>
                      </td>
                      <td className="px-2.5 py-3 text-right tabular-nums whitespace-nowrap">
                        {formatCurrency(bidder.rawTotal, sym, 0)}
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums whitespace-nowrap">
                        <span
                          className="font-semibold"
                          style={{
                            color: bidder.isFalseLowBid ? 'var(--danger)' : 'var(--muted)',
                          }}
                        >
                          #{bidder.rawRank}
                        </span>
                      </td>
                      <td
                        className="px-2 py-3 text-right tabular-nums whitespace-nowrap"
                        style={{
                          color: bidder.omittedCount > 0 ? 'var(--danger)' : 'var(--body-text)',
                          fontWeight: bidder.omittedCount > 0 ? 600 : 400,
                        }}
                      >
                        {bidder.omittedCount}
                      </td>
                      <td className="px-2.5 py-3 text-right whitespace-nowrap">
                        <DataBar
                          value={bidder.omissionPlugTotal}
                          max={maxOmissionTotal}
                          label={formatCurrency(bidder.omissionPlugTotal, sym, 0)}
                          emphasis={bidder.omissionPlugTotal > 0 ? 'danger' : 'brand'}
                        />
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums whitespace-nowrap">
                        {formatPercent(bidder.omissionShareOfRawPct, 1)}
                      </td>
                      <td className="px-2.5 py-3 text-right whitespace-nowrap">
                        <DataBar
                          value={bidder.leveledTotal}
                          max={maxLeveledTotal}
                          label={formatCurrency(bidder.leveledTotal, sym, 0)}
                          emphasis={bidder.leveledRank === 1 ? 'accent' : 'brand'}
                        />
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums whitespace-nowrap">
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              bidder.leveledRank === 1 ? 'var(--accent)' : 'var(--brand)',
                          }}
                        >
                          #{bidder.leveledRank}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right whitespace-nowrap">
                        <StatusPill
                          label={`${bidder.redFlagCount} Flag${bidder.redFlagCount === 1 ? '' : 's'}`}
                          tone={bidder.redFlagCount > 0 ? 'danger' : 'neutral'}
                          onClick={() =>
                            setBidderFilter((prev) =>
                              prev === bidder.bidderCode ? 'ALL' : bidder.bidderCode
                            )
                          }
                          title={`Filter clarifications for ${bidder.bidderName}`}
                          ariaLabel={`Filter clarifications by ${bidder.bidderName}: ${bidder.redFlagCount} flags`}
                        />
                      </td>
                      <td
                        className="px-2.5 py-3 text-right tabular-nums whitespace-nowrap"
                        style={{
                          color: bidder.isOverBudget ? 'var(--danger)' : 'var(--body-text)',
                          fontWeight: bidder.isOverBudget ? 600 : 400,
                        }}
                      >
                        {formatSignedPercent(bidder.varianceVsBenchmarkPct, 1)}
                      </td>
                      <td className="px-2.5 py-3 whitespace-nowrap">
                        <StatusPill
                          label={bidder.awardConclusion}
                          tone={bidder.verdictTone}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Supporting Visual Comparison Chart: Raw Bid vs Omission Plug Add-Back */}
      <section aria-label="Raw bid versus omission plug comparison chart">
        <div className="tw-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="tw-section-title">
                Scope-Equalized Cost Composition vs. Benchmark
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>
                Stacked breakdown comparing submitted raw bid against plugged omission add-backs
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[12px]" style={{ color: 'var(--muted)' }}>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: 'var(--brand)' }}
                />
                Raw Submitted Bid
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: 'var(--danger)' }}
                />
                Omission Plug Add-Back
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-[2px]"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                Internal Benchmark ({formatCurrency(totals.benchmarkTotal, sym, 0)})
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {bidderSummaries.map((bidder) => {
              const scaleMax = maxLeveledTotal * 1.06;
              const rawWidthPct = (bidder.rawTotal / scaleMax) * 100;
              const plugWidthPct = (bidder.omissionPlugTotal / scaleMax) * 100;
              const benchPosPct = (totals.benchmarkTotal / scaleMax) * 100;

              return (
                <div key={bidder.bidderCode} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-[12px]">
                    <span className="font-medium" style={{ color: 'var(--brand)' }}>
                      {bidder.bidderName}{' '}
                      <span style={{ color: 'var(--muted)' }}>
                        (Raw #{bidder.rawRank} → True #{bidder.leveledRank})
                      </span>
                    </span>
                    <span className="tabular-nums font-semibold" style={{ color: 'var(--brand)' }}>
                      {formatCurrency(bidder.leveledTotal, sym, 0)}
                      {bidder.omissionPlugTotal > 0 && (
                        <span className="ml-2 font-medium" style={{ color: 'var(--danger)' }}>
                          +{formatCurrency(bidder.omissionPlugTotal, sym, 0)} plugged
                        </span>
                      )}
                    </span>
                  </div>

                  <div
                    className="relative h-6 w-full overflow-hidden"
                    style={{
                      backgroundColor: 'var(--bar-track)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div className="flex h-full w-full">
                      <div
                        className="h-full transition-[width] duration-300 ease-out"
                        style={{
                          width: `${rawWidthPct}%`,
                          backgroundColor: 'var(--brand)',
                        }}
                        title={`Raw bid: ${formatCurrency(bidder.rawTotal, sym, 2)}`}
                      />
                      {bidder.omissionPlugTotal > 0 && (
                        <div
                          className="h-full transition-[width] duration-300 ease-out"
                          style={{
                            width: `${plugWidthPct}%`,
                            backgroundColor: 'var(--danger)',
                          }}
                          title={`Omission plug: ${formatCurrency(bidder.omissionPlugTotal, sym, 2)}`}
                        />
                      )}
                    </div>
                    {totals.benchmarkTotal > 0 && (
                      <div
                        className="absolute top-0 bottom-0 w-[2px]"
                        style={{
                          left: `${Math.min(benchPosPct, 99.5)}%`,
                          backgroundColor: 'var(--accent)',
                        }}
                        title={`Internal benchmark: ${formatCurrency(totals.benchmarkTotal, sym, 2)}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lower Zone: Unbalanced Bidding Red-Flag & Tender Clarification List (All 14 Workbook Fields) */}
      <section aria-label="Unbalanced bidding red-flag clarification list">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="tw-section-title">
              2. Unbalanced Bidding Red-Flag &amp; Clarification List
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>
              Auto-filtered BOQ items where any bidder&apos;s rate exceeds +
              {formatNumber(parameters.unbalancedThresholdPct, 1)}% above internal benchmark
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bidder Filter Segmented Controls */}
            <div
              className="inline-flex items-center p-0.5"
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-sm)',
              }}
              role="group"
              aria-label="Filter clarifications by subcontractor"
            >
              {(['ALL', 'A', 'B', 'C'] as const).map((key) => {
                const active = bidderFilter === key;
                const label = key === 'ALL' ? 'All Bidders' : `Sub. ${key}`;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBidderFilter(key)}
                    className="px-2.5 py-1 text-[12px] font-medium whitespace-nowrap cursor-pointer transition-colors duration-150"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: active ? 'var(--brand)' : 'transparent',
                      color: active ? 'var(--surface)' : 'var(--muted)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onExportClarificationsCsv}
              disabled={clarifications.length === 0}
              className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Export Clarification CSV</span>
            </button>
          </div>
        </div>

        {filteredClarifications.length === 0 ? (
          <div className="tw-card p-10 text-center">
            <p
              className="font-editorial text-[19px] font-semibold"
              style={{ color: 'var(--brand)' }}
            >
              {clarifications.length === 0
                ? 'No Unbalanced Bidding Anomalies Detected'
                : `No Red-Flag Items for Subcontractor ${bidderFilter}`}
            </p>
            <p className="mt-1.5 text-[13px]" style={{ color: 'var(--muted)' }}>
              {clarifications.length === 0
                ? `All submitted subcontractor unit rates are within the +${formatNumber(
                    parameters.unbalancedThresholdPct,
                    1
                  )}% benchmark threshold.`
                : 'Select "All Bidders" to inspect red-flag clarification items raised for other subcontractors.'}
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
                    <th scope="col" className="text-right">Qty</th>
                    <th scope="col" className="text-right">Benchmark Rate</th>
                    <th scope="col" className="text-right">Sub. A Rate</th>
                    <th scope="col" className="text-right">Sub. A Dev.</th>
                    <th scope="col" className="text-left">Sub. A Flag</th>
                    <th scope="col" className="text-right">Sub. B Rate</th>
                    <th scope="col" className="text-right">Sub. B Dev.</th>
                    <th scope="col" className="text-left">Sub. B Flag</th>
                    <th scope="col" className="text-right">Sub. C Rate</th>
                    <th scope="col" className="text-right">Sub. C Dev.</th>
                    <th scope="col" className="text-left">Sub. C Flag</th>
                    <th scope="col" className="text-left">Clarification Directive</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClarifications.map((item) => (
                    <tr key={item.id} className="tw-table-row tw-table-row-anomaly">
                      <td className="px-3.5 py-3 tabular-nums font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onInspectBoqItem(item.boqCode, 'boq-input')}
                          className="underline-offset-2 hover:underline cursor-pointer"
                          style={{ color: 'var(--accent)' }}
                          title={`Edit ${item.boqCode} in Sheet 01`}
                        >
                          {item.boqCode}
                        </button>
                      </td>
                      <td
                        className="px-3.5 py-3 min-w-[210px] font-medium"
                        style={{ color: 'var(--brand)' }}
                      >
                        {item.itemName}
                      </td>
                      <td className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap">
                        {formatNumber(item.quantity, 2)} {item.unit}
                      </td>
                      <td className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap">
                        {formatCurrency(item.benchmarkUnitRate, sym, 2)}
                      </td>

                      {/* Subcontractor A */}
                      <td className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap">
                        {item.bidderARate > 0
                          ? formatCurrency(item.bidderARate, sym, 2)
                          : 'Omitted'}
                      </td>
                      <td
                        className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap"
                        style={{
                          color:
                            item.bidderAFlag === 'Red Flag'
                              ? 'var(--danger)'
                              : 'var(--muted)',
                          fontWeight: item.bidderAFlag === 'Red Flag' ? 600 : 400,
                        }}
                      >
                        {formatSignedPercent(item.bidderADeviationPct, 1)}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <StatusPill
                          label={item.bidderAFlag}
                          tone={redFlagTone(item.bidderAFlag)}
                          onClick={() => onInspectBoqItem(item.boqCode, 'leveling-engine')}
                          title={`Inspect ${item.boqCode} in Leveling Engine`}
                          ariaLabel={`Inspect ${item.boqCode} Subcontractor A status: ${item.bidderAFlag}`}
                        />
                      </td>

                      {/* Subcontractor B */}
                      <td className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap">
                        {item.bidderBRate > 0
                          ? formatCurrency(item.bidderBRate, sym, 2)
                          : 'Omitted'}
                      </td>
                      <td
                        className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap"
                        style={{
                          color:
                            item.bidderBFlag === 'Red Flag'
                              ? 'var(--danger)'
                              : 'var(--muted)',
                          fontWeight: item.bidderBFlag === 'Red Flag' ? 600 : 400,
                        }}
                      >
                        {formatSignedPercent(item.bidderBDeviationPct, 1)}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <StatusPill
                          label={item.bidderBFlag}
                          tone={redFlagTone(item.bidderBFlag)}
                          onClick={() => onInspectBoqItem(item.boqCode, 'leveling-engine')}
                          title={`Inspect ${item.boqCode} in Leveling Engine`}
                          ariaLabel={`Inspect ${item.boqCode} Subcontractor B status: ${item.bidderBFlag}`}
                        />
                      </td>

                      {/* Subcontractor C */}
                      <td className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap">
                        {item.bidderCRate > 0
                          ? formatCurrency(item.bidderCRate, sym, 2)
                          : 'Omitted'}
                      </td>
                      <td
                        className="px-3.5 py-3 text-right tabular-nums whitespace-nowrap"
                        style={{
                          color:
                            item.bidderCFlag === 'Red Flag'
                              ? 'var(--danger)'
                              : 'var(--muted)',
                          fontWeight: item.bidderCFlag === 'Red Flag' ? 600 : 400,
                        }}
                      >
                        {formatSignedPercent(item.bidderCDeviationPct, 1)}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <StatusPill
                          label={item.bidderCFlag}
                          tone={redFlagTone(item.bidderCFlag)}
                          onClick={() => onInspectBoqItem(item.boqCode, 'leveling-engine')}
                          title={`Inspect ${item.boqCode} in Leveling Engine`}
                          ariaLabel={`Inspect ${item.boqCode} Subcontractor C status: ${item.bidderCFlag}`}
                        />
                      </td>

                      {/* Clarification Directive */}
                      <td
                        className="px-3.5 py-3 min-w-[300px] text-[12px] leading-snug"
                        style={{ color: 'var(--brand)' }}
                      >
                        {item.clarificationDirective}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
