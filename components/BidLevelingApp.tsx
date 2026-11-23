'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type {
  BoqLineItem,
  GlobalParameters,
  SheetTabId,
  WorkbookState,
} from '@/lib/types';
import { DEFAULT_BOQ_ITEMS, DEFAULT_PARAMETERS } from '@/lib/seed-data';
import { calculateWorkbook } from '@/lib/bid-leveling';
import {
  createBackupPayload,
  exportBoqToCsv,
  exportClarificationsToCsv,
  getBackupFilename,
  validateBackupJson,
} from '@/lib/data-io';
import { TopNav } from './TopNav';
import { DataToolbar, type ToolbarNotice } from './DataToolbar';
import { DashboardView } from './DashboardView';
import { BoqInputView } from './BoqInputView';
import { LevelingEngineView } from './LevelingEngineView';
import { ParametersView } from './ParametersView';
import { CsvImportModal } from './CsvImportModal';
import { ResetConfirmModal } from './ResetConfirmModal';

const STORAGE_KEY = 'theseus-workshop-boq-bid-leveling-v1';

const VALID_TABS: SheetTabId[] = [
  'parameters',
  'boq-input',
  'leveling-engine',
  'dashboard',
];

function parseTabFromHash(hash: string): SheetTabId | null {
  const cleaned = hash.replace(/^#/, '').trim() as SheetTabId;
  return VALID_TABS.includes(cleaned) ? cleaned : null;
}

function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function loadStoredWorkbook(): WorkbookState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WorkbookState>;
    if (parsed.parameters && Array.isArray(parsed.boqItems)) {
      return {
        parameters: { ...DEFAULT_PARAMETERS, ...parsed.parameters },
        boqItems: parsed.boqItems,
        lastSavedAt: parsed.lastSavedAt ?? new Date().toISOString(),
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function BidLevelingApp() {
  const [workbook, setWorkbook] = useState<WorkbookState>({
    parameters: DEFAULT_PARAMETERS,
    boqItems: DEFAULT_BOQ_ITEMS,
    lastSavedAt: null,
  });
  const [activeTab, setActiveTab] = useState<SheetTabId>('dashboard');
  const [highlightedBoqCode, setHighlightedBoqCode] = useState<string | null>(null);
  const [notice, setNotice] = useState<ToolbarNotice | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const hasHydratedRef = React.useRef(false);

  // Hydrate persisted state & URL hash on mount via microtask callback (avoids sync setState in effect)
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = loadStoredWorkbook();
      if (stored) {
        setWorkbook(stored);
      } else {
        const now = new Date().toISOString();
        const initial: WorkbookState = {
          parameters: DEFAULT_PARAMETERS,
          boqItems: DEFAULT_BOQ_ITEMS,
          lastSavedAt: now,
        };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        } catch {
          // Ignore storage quota / private mode errors
        }
        setWorkbook(initial);
      }

      const hashTab = parseTabFromHash(window.location.hash);
      if (hashTab) {
        setActiveTab(hashTab);
      }
      hasHydratedRef.current = true;
    });

    const handleHashChange = () => {
      const next = parseTabFromHash(window.location.hash);
      if (next) setActiveTab(next);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      active = false;
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Pure external synchronization to localStorage whenever workbook changes after hydration
  useEffect(() => {
    if (!hasHydratedRef.current || !workbook.lastSavedAt) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workbook));
    } catch {
      // Storage unavailable
    }
  }, [workbook]);

  const { parameters, boqItems, lastSavedAt } = workbook;

  const handleSelectTab = useCallback((tab: SheetTabId) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  }, []);

  const handleUpdateParameters = useCallback((patch: Partial<GlobalParameters>) => {
    setWorkbook((prev) => ({
      ...prev,
      parameters: { ...prev.parameters, ...patch },
      lastSavedAt: new Date().toISOString(),
    }));
  }, []);

  const handleUpdateItem = useCallback((id: string, patch: Partial<BoqLineItem>) => {
    setWorkbook((prev) => ({
      ...prev,
      boqItems: prev.boqItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
      lastSavedAt: new Date().toISOString(),
    }));
  }, []);

  const handleAddItem = useCallback(() => {
    const nextIndex = workbook.boqItems.length + 1;
    const code = `019900${String(nextIndex).padStart(3, '0')}`;
    const newItem: BoqLineItem = {
      id: `boq-${Date.now()}`,
      boqCode: code,
      itemName: 'New BOQ Line Item',
      unit: 'm²',
      quantity: 100,
      benchmarkUnitRate: 100,
      bidderARawRate: 100,
      bidderBRawRate: 100,
      bidderCRawRate: 100,
    };
    setWorkbook((prev) => ({
      ...prev,
      boqItems: [...prev.boqItems, newItem],
      lastSavedAt: new Date().toISOString(),
    }));
    setHighlightedBoqCode(code);
    setNotice({
      tone: 'neutral',
      message: `Added BOQ line item ${code}. Calculations updated automatically.`,
    });
  }, [workbook.boqItems.length]);

  const handleDeleteItem = useCallback(
    (id: string) => {
      const target = workbook.boqItems.find((item) => item.id === id);
      setWorkbook((prev) => ({
        ...prev,
        boqItems: prev.boqItems.filter((item) => item.id !== id),
        lastSavedAt: new Date().toISOString(),
      }));
      if (target) {
        setNotice({
          tone: 'neutral',
          message: `Removed BOQ item ${target.boqCode} (${target.itemName}).`,
        });
      }
    },
    [workbook.boqItems]
  );

  const handleExportBackup = useCallback(() => {
    const payload = createBackupPayload(parameters, boqItems);
    const filename = getBackupFilename();
    triggerFileDownload(
      JSON.stringify(payload, null, 2),
      filename,
      'application/json;charset=utf-8'
    );
    setNotice({
      tone: 'ok',
      message: `Exported backup file "${filename}".`,
    });
  }, [parameters, boqItems]);

  const handleImportBackupFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setNotice({
          tone: 'danger',
          message: 'Unable to read backup file content.',
        });
        return;
      }
      const validation = validateBackupJson(reader.result);
      if (!validation.ok || !validation.data) {
        setNotice({
          tone: 'danger',
          message: validation.error || 'Backup file validation failed.',
        });
        return;
      }
      const nextData = validation.data;
      setWorkbook({
        parameters: nextData.parameters,
        boqItems: nextData.boqItems,
        lastSavedAt: new Date().toISOString(),
      });
      setNotice({
        tone: 'ok',
        message: `Restored backup (${nextData.boqItems.length} BOQ items and global parameters).`,
      });
    };
    reader.onerror = () => {
      setNotice({
        tone: 'danger',
        message: 'Failed to read the selected backup file.',
      });
    };
    reader.readAsText(file);
  }, []);

  const handleImportCsvItems = useCallback(
    (items: BoqLineItem[], mode: 'append' | 'replace') => {
      setWorkbook((prev) => ({
        ...prev,
        boqItems: mode === 'replace' ? items : [...prev.boqItems, ...items],
        lastSavedAt: new Date().toISOString(),
      }));
      handleSelectTab('boq-input');
      setNotice({
        tone: 'ok',
        message:
          mode === 'replace'
            ? `Replaced BOQ table with ${items.length} imported CSV item${items.length === 1 ? '' : 's'}.`
            : `Appended ${items.length} CSV item${items.length === 1 ? '' : 's'} to Sheet 01.`,
      });
    },
    [handleSelectTab]
  );

  const handleConfirmReset = useCallback(() => {
    setWorkbook({
      parameters: DEFAULT_PARAMETERS,
      boqItems: DEFAULT_BOQ_ITEMS,
      lastSavedAt: new Date().toISOString(),
    });
    setHighlightedBoqCode(null);
    setResetModalOpen(false);
    setNotice({
      tone: 'ok',
      message: 'Workbook reset to initial default dataset.',
    });
  }, []);

  const calculationResult = useMemo(
    () => calculateWorkbook(boqItems, parameters),
    [boqItems, parameters]
  );

  const handleExportBoqCsv = useCallback(() => {
    const csv = exportBoqToCsv(boqItems, parameters);
    triggerFileDownload(
      csv,
      `boq-raw-bids-${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8'
    );
    setNotice({
      tone: 'ok',
      message: 'Exported Sheet 01 BOQ & Raw Bids as CSV.',
    });
  }, [boqItems, parameters]);

  const handleExportClarificationsCsv = useCallback(() => {
    const csv = exportClarificationsToCsv(calculationResult.clarifications, parameters);
    triggerFileDownload(
      csv,
      `tender-clarification-list-${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8'
    );
    setNotice({
      tone: 'ok',
      message: 'Exported Unbalanced Bidding Clarification List as CSV.',
    });
  }, [calculationResult.clarifications, parameters]);

  const handleInspectBoqItem = useCallback(
    (boqCode: string, target: 'boq-input' | 'leveling-engine') => {
      setHighlightedBoqCode(boqCode);
      handleSelectTab(target);
    },
    [handleSelectTab]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        clarificationCount={calculationResult.clarifications.length}
        boqCount={boqItems.length}
      />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pt-8 pb-16 sm:px-6 lg:px-10">
        <DataToolbar
          lastSavedAt={lastSavedAt}
          onExportBackup={handleExportBackup}
          onImportBackupFile={handleImportBackupFile}
          onOpenCsvImport={() => setCsvModalOpen(true)}
          onOpenResetConfirm={() => setResetModalOpen(true)}
          notice={notice}
          onDismissNotice={() => setNotice(null)}
        />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.0, 0.0, 0.2, 1.0] }}
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              result={calculationResult}
              parameters={parameters}
              onExportClarificationsCsv={handleExportClarificationsCsv}
              onInspectBoqItem={handleInspectBoqItem}
            />
          )}

          {activeTab === 'boq-input' && (
            <BoqInputView
              boqItems={boqItems}
              parameters={parameters}
              totals={calculationResult.totals}
              highlightedBoqCode={highlightedBoqCode}
              onUpdateItem={handleUpdateItem}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onExportCsv={handleExportBoqCsv}
              onOpenCsvImport={() => setCsvModalOpen(true)}
            />
          )}

          {activeTab === 'leveling-engine' && (
            <LevelingEngineView
              result={calculationResult}
              parameters={parameters}
              highlightedBoqCode={highlightedBoqCode}
              onJumpToInput={(code) => handleInspectBoqItem(code, 'boq-input')}
            />
          )}

          {activeTab === 'parameters' && (
            <ParametersView
              parameters={parameters}
              onUpdateParameters={handleUpdateParameters}
            />
          )}
        </motion.div>
      </main>

      <footer className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
        <p
          className="text-center text-[12px]"
          style={{
            color: 'var(--muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: '16px',
          }}
        >
          All data in this tool is stored in your browser&apos;s localStorage. The page itself does
          not retain any user data.
        </p>
      </footer>

      <CsvImportModal
        open={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onImportItems={handleImportCsvItems}
      />

      <ResetConfirmModal
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
