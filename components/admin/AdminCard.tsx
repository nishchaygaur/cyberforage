import React from "react";

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className = "",
  title,
  description,
  headerAction,
}) => {
  return (
    <div
      className={`rounded-xl bg-[#081220]/90 border border-white/[0.08] hover:border-white/[0.14] transition-all p-5 sm:p-6 backdrop-blur-sm ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/[0.06]">
          <div>
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
