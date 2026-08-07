import React from 'react';

export const ConfirmDialog: React.FC<{ title: string; message: string; confirmLabel: string; busy?: boolean; onConfirm: () => void; onClose: () => void }> = ({ title, message, confirmLabel, busy, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
      <h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button><button disabled={busy} onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Working…' : confirmLabel}</button></div>
    </div>
  </div>
);
