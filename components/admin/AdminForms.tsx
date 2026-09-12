"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AdminInput: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-medium text-slate-300">
        {label}
      </label>
      <input
        id={inputId}
        className={`px-3 py-2 rounded-lg bg-black/40 border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0]/50 transition-colors ${
          error ? "border-rose-500/80" : "border-white/10"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      )}
    </div>
  );
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AdminTextarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  id,
  className = "",
  rows = 4,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-medium text-slate-300">
        {label}
      </label>
      <textarea
        id={inputId}
        rows={rows}
        className={`px-3 py-2 rounded-lg bg-black/40 border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0]/50 transition-colors leading-relaxed ${
          error ? "border-rose-500/80" : "border-white/10"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      )}
    </div>
  );
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  helperText?: string;
}

export const AdminSelect: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-medium text-slate-300">
        {label}
      </label>
      <select
        id={inputId}
        className={`px-3 py-2 rounded-lg bg-[#081220] border text-xs text-white focus:outline-none focus:border-[#00F0C0]/50 transition-colors ${
          error ? "border-rose-500/80" : "border-white/10"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#081220] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-rose-400">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      )}
    </div>
  );
};

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const AdminToggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-xs font-medium text-slate-200 block">{label}</span>
        {description && (
          <span className="text-[11px] text-slate-500 block">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 ${
          checked ? "bg-[#00F0C0]" : "bg-slate-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
