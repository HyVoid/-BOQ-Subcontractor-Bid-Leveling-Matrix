'use client';

import React from 'react';

export type PillTone = 'neutral' | 'positive' | 'danger' | 'accent';

interface StatusPillProps {
  label: string;
  tone?: PillTone;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
}

export function StatusPill({
  label,
  tone = 'neutral',
  onClick,
  title,
  ariaLabel,
}: StatusPillProps) {
  const styleMap: Record<PillTone, React.CSSProperties> = {
    neutral: {
      backgroundColor: 'var(--muted-bg)',
      color: 'var(--muted)',
    },
    positive: {
      backgroundColor: 'var(--ok-bg)',
      color: 'var(--ok)',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger)',
    },
    accent: {
      backgroundColor: 'var(--accent-soft)',
      color: 'var(--accent)',
    },
  };

  const baseClass =
    'tw-matrix-cell px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap leading-tight';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={ariaLabel || label}
        className={`${baseClass} tw-matrix-cell-clickable focus-visible:outline-2 focus-visible:outline-offset-2`}
        style={{
          ...styleMap[tone],
          outlineColor: 'var(--accent)',
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={baseClass} style={styleMap[tone]} title={title}>
      {label}
    </span>
  );
}
