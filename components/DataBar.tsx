'use client';

import React from 'react';

interface DataBarProps {
  value: number;
  max: number;
  label: string;
  emphasis?: 'accent' | 'danger' | 'brand';
}

export function DataBar({ value, max, label, emphasis = 'accent' }: DataBarProps) {
  const safeMax = max > 0 ? max : 1;
  const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));

  const fillColor =
    emphasis === 'danger'
      ? 'var(--danger)'
      : emphasis === 'brand'
      ? 'var(--brand)'
      : 'var(--accent)';

  return (
    <div className="flex flex-col items-end gap-1 min-w-[92px]">
      <span
        className="tabular-nums font-medium"
        style={{
          color: emphasis === 'danger' ? 'var(--danger)' : 'var(--brand)',
        }}
      >
        {label}
      </span>
      <div
        className="w-full h-[5px] overflow-hidden"
        style={{
          backgroundColor: 'var(--bar-track)',
          borderRadius: 'var(--radius-pill)',
        }}
        aria-hidden="true"
      >
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: fillColor,
            borderRadius: 'var(--radius-pill)',
          }}
        />
      </div>
    </div>
  );
}
