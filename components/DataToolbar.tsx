'use client';

import React, { useRef } from 'react';
import {
  Clock,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react';
import { formatSavedTimestamp } from '@/lib/bid-leveling';

export interface ToolbarNotice {
  tone: 'ok' | 'danger' | 'neutral';
  message: string;
}

interface DataToolbarProps {
  lastSavedAt: string | null;
  onExportBackup: () => void;
  onImportBackupFile: (file: File) => void;
  onOpenCsvImport: () => void;
  onOpenResetConfirm: () => void;
  notice: ToolbarNotice | null;
  onDismissNotice: () => void;
}

export function DataToolbar({
  lastSavedAt,
  onExportBackup,
  onImportBackupFile,
  onOpenCsvImport,
  onOpenResetConfirm,
  notice,
  onDismissNotice,
}: DataToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackupFile(file);
    }
    e.target.value = '';
  };

  return (
    <div className="mb-8 flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4"
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Left: Persistent Last Saved indicator */}
        <div
          className="flex items-center gap-2 text-[12px] tabular-nums"
          style={{ color: 'var(--muted)' }}
          data-testid="last-saved-indicator"
        >
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            Last saved:{' '}
            <strong className="font-medium" style={{ color: 'var(--brand)' }}>
              {formatSavedTimestamp(lastSavedAt)}
            </strong>
          </span>
        </div>

        {/* Right: Data Management Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenCsvImport}
            className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            type="button"
            onClick={onExportBackup}
            className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export Backup</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Import Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload JSON backup file"
          />

          <button
            type="button"
            onClick={onOpenResetConfirm}
            className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 whitespace-nowrap cursor-pointer"
            style={{ color: 'var(--danger)' }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {notice && (
        <div
          role={notice.tone === 'danger' ? 'alert' : 'status'}
          className="flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] font-medium"
          style={{
            backgroundColor:
              notice.tone === 'danger'
                ? 'var(--anomaly-bg)'
                : notice.tone === 'ok'
                ? 'var(--ok-bg)'
                : 'var(--insight-bg)',
            color:
              notice.tone === 'danger'
                ? 'var(--danger)'
                : notice.tone === 'ok'
                ? 'var(--brand)'
                : 'var(--brand)',
            borderLeft: `3px solid ${
              notice.tone === 'danger'
                ? 'var(--danger)'
                : notice.tone === 'ok'
                ? 'var(--ok)'
                : 'var(--accent)'
            }`,
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={onDismissNotice}
            aria-label="Dismiss notification"
            className="p-1 cursor-pointer opacity-70 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
