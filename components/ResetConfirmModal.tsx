'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({
  open,
  onCancel,
  onConfirm,
}: ResetConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="tw-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-confirm-title"
    >
      <div className="tw-modal-surface w-full max-w-md p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle
              className="h-5 w-5 shrink-0"
              style={{ color: 'var(--danger)' }}
              aria-hidden="true"
            />
            <h2 id="reset-confirm-title" className="tw-section-title">
              Reset Workbook Data?
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel reset confirmation"
            className="p-1 cursor-pointer"
            style={{ color: 'var(--muted)' }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'var(--body-text)' }}>
          This will overwrite your browser&apos;s saved parameters and BOQ bid table with the
          original default workbook dataset. Consider exporting a JSON backup before proceeding.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="tw-btn tw-btn-secondary px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="tw-btn tw-btn-danger px-4 py-2 cursor-pointer"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
