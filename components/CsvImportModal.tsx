'use client';

import React, { useRef, useState } from 'react';
import { FileSpreadsheet, Upload, X } from 'lucide-react';
import type { BoqLineItem } from '@/lib/types';
import { parseBoqCsv, SAMPLE_BOQ_CSV } from '@/lib/data-io';

interface CsvImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportItems: (items: BoqLineItem[], mode: 'append' | 'replace') => void;
}

export function CsvImportModal({
  open,
  onClose,
  onImportItems,
}: CsvImportModalProps) {
  const [csvText, setCsvText] = useState('');
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCsvText(reader.result);
        setErrors([]);
      }
    };
    reader.onerror = () => {
      setErrors(['Failed to read the selected CSV file. Please try again.']);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseBoqCsv(csvText);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    onImportItems(result.items, mode);
    setCsvText('');
    setErrors([]);
    onClose();
  };

  return (
    <div
      className="tw-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="csv-import-title"
    >
      <div className="tw-modal-surface w-full max-w-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet
              className="h-5 w-5 shrink-0"
              style={{ color: 'var(--accent)' }}
              aria-hidden="true"
            />
            <div>
              <h2 id="csv-import-title" className="tw-section-title">
                Bulk CSV Import — Sheet 01 (BOQ &amp; Raw Bids)
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>
                Columns: BOQ Code, Item Description, Unit, Quantity, Benchmark Rate, Sub. A Rate,
                Sub. B Rate, Sub. C Rate (leave blank for omissions).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bulk CSV import modal"
            className="p-1 cursor-pointer"
            style={{ color: 'var(--muted)' }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="tw-btn tw-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Choose CSV File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Select CSV file to import"
              />
              <button
                type="button"
                onClick={() => {
                  setCsvText(SAMPLE_BOQ_CSV);
                  setErrors([]);
                }}
                className="tw-btn tw-btn-secondary px-3 py-1.5 cursor-pointer"
              >
                Load Sample CSV
              </button>
            </div>

            <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--brand)' }}>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="csv-import-mode"
                  value="append"
                  checked={mode === 'append'}
                  onChange={() => setMode('append')}
                />
                <span>Append rows</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="csv-import-mode"
                  value="replace"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                />
                <span>Replace existing BOQ</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="csv-paste-area"
              className="tw-label-caps block mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              Paste CSV Rows
            </label>
            <textarea
              id="csv-paste-area"
              rows={7}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                if (errors.length > 0) setErrors([]);
              }}
              placeholder={SAMPLE_BOQ_CSV}
              className="tw-input w-full p-3 font-mono text-[12px] leading-relaxed"
            />
          </div>

          {errors.length > 0 && (
            <div
              role="alert"
              className="p-3 text-[12px] space-y-1"
              style={{
                backgroundColor: 'var(--anomaly-bg)',
                color: 'var(--danger)',
                borderLeft: '3px solid var(--danger)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}
            >
              <p className="font-semibold">CSV validation failed:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {errors.slice(0, 6).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="tw-btn tw-btn-secondary px-4 py-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tw-btn tw-btn-primary px-4 py-2 cursor-pointer"
            >
              Validate &amp; Import Rows
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
