import React from "react";

interface AdminStatusBadgeProps {
  status: string;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, className = "" }) => {
  const getStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case "published":
      case "active":
      case "available":
      case "completed":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "draft":
      case "planning":
      case "in_development":
      case "coming_soon":
      case "new":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "archived":
      case "inactive":
        return "bg-slate-500/15 text-slate-400 border-slate-500/30";
      case "replied":
        return "bg-[#00F0C0]/15 text-[#00F0C0] border-[#00F0C0]/30";
      case "super_admin":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "admin":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      default:
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase border ${getStyle(
        status
      )} ${className}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
};
