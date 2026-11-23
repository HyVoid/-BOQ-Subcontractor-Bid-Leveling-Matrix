'use client';

import React from 'react';
import type { SheetTabId } from '@/lib/types';

interface NavTabItem {
  id: SheetTabId;
  code: string;
  label: string;
  badgeCount?: number;
}

interface TopNavProps {
  activeTab: SheetTabId;
  onSelectTab: (tab: SheetTabId) => void;
  clarificationCount: number;
  boqCount: number;
}

export function TopNav({
  activeTab,
  onSelectTab,
  clarificationCount,
  boqCount,
}: TopNavProps) {
  const tabs: Array<NavTabItem & { shortLabel: string }> = [
    { id: 'parameters', code: '00', label: 'Parameters', shortLabel: 'Params' },
    { id: 'boq-input', code: '01', label: 'BOQ & Raw Bids', shortLabel: 'BOQ' },
    { id: 'leveling-engine', code: '02', label: 'Leveling Engine', shortLabel: 'Engine' },
    {
      id: 'dashboard',
      code: '03',
      label: 'Bid Dashboard',
      shortLabel: 'Board',
      badgeCount: clarificationCount > 0 ? clarificationCount : undefined,
    },
  ];

  return (
    <header className="tw-nav-bar sticky top-0 z-30 w-full">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-10">
        {/* Left: Fixed brand name + concise product description */}
        <div className="flex items-baseline gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="font-editorial text-[17px] sm:text-[20px] font-semibold tracking-[-0.02em] whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: 'var(--brand)', outlineColor: 'var(--accent)' }}
          >
            Theseus Workshop
          </button>
          <span
            className="hidden lg:inline text-[12px] whitespace-nowrap truncate"
            style={{ color: 'var(--muted)' }}
          >
            BOQ Bid Leveling Matrix
          </span>
        </div>

        {/* Right: Workbook Sheet Tabs */}
        <nav
          aria-label="Workbook sheets"
          role="tablist"
          className="flex h-full items-stretch gap-1.5 sm:gap-5 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${tab.code} ${tab.label}`}
                onClick={() => onSelectTab(tab.id)}
                className="relative flex items-center gap-1 sm:gap-1.5 px-1 sm:px-1 text-[12px] sm:text-[13px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                style={{
                  color: isActive ? 'var(--brand)' : 'var(--nav-text-inactive)',
                  borderBottom: isActive
                    ? '3px solid var(--accent)'
                    : '3px solid transparent',
                  outlineColor: 'var(--accent)',
                }}
              >
                <span
                  className="hidden sm:inline tabular-nums text-[11px] font-semibold opacity-70"
                  aria-hidden="true"
                >
                  {tab.code}
                </span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.id === 'dashboard' && clarificationCount > 0 && (
                  <span
                    className="tabular-nums text-[11px] font-semibold"
                    style={{ color: 'var(--danger)' }}
                    aria-label={`${clarificationCount} red-flag clarifications`}
                  >
                    ({clarificationCount})
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
