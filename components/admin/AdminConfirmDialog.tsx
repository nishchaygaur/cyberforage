"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface AdminConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "warning" | "primary";
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmText,
  confirmVariant,
  variant,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const resolvedLabel = confirmText || confirmLabel || "Confirm";
  const resolvedVariant = variant || confirmVariant || "danger";

  const getConfirmBtnStyle = () => {
    switch (resolvedVariant) {
      case "danger":
        return "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]";
      case "warning":
        return "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]";
      default:
        return "bg-[#00F0C0] hover:bg-[#00E5BE] text-[#04131E] shadow-[0_0_20px_rgba(0,240,192,0.3)]";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#081220] border border-white/10 p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${getConfirmBtnStyle()} ${
              isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : resolvedLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
