"use client";

import React, { useState, useMemo } from "react";
import { Search, ExternalLink, Shield, Terminal, Box, Bug, Network, Cpu, BookOpen } from "lucide-react";
import { LabRow } from "@/lib/data/labs";
import { AVAILABLE_LABS, LabItem } from "@/lib/constants/siteData";

interface LabsDirectoryProps {
  labRows?: LabRow[];
  fallbackLabs?: LabItem[];
}

export const LabsDirectory: React.FC<LabsDirectoryProps> = ({
  labRows = [],
  fallbackLabs = AVAILABLE_LABS,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Normalize data between DB rows and fallback items
  const labs = useMemo(() => {
    if (labRows && labRows.length > 0) {
      return labRows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category || "Security",
        description: r.description || "Hands-on defensive security scenario and simulation environment.",
        difficulty: r.difficulty || "Intermediate",
        status: r.status || "Ready",
        url: r.url,
        github_url: r.github_url,
      }));
    }

    return fallbackLabs.map((f, idx) => ({
      id: `lab-${idx}`,
      name: f.name,
      category: f.category,
      description: `Hands-on practical environment focused on ${f.category.toLowerCase()} telemetry and attack simulation.`,
      difficulty: "Intermediate",
      status: "Ready",
      url: null,
      github_url: null,
    }));
  }, [labRows, fallbackLabs]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    labs.forEach((l) => {
      if (l.category) cats.add(l.category);
    });
    return ["All", ...Array.from(cats)];
  }, [labs]);

  const filteredLabs = useMemo(() => {
    return labs.filter((l) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" ||
        l.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [labs, searchQuery, selectedCategory]);

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "advanced":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "expert":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "beginner":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "intermediate":
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const getLabIcon = (name: string, category: string) => {
    const combined = (name + " " + category).toLowerCase();
    if (combined.includes("attack") || combined.includes("cyberforge") || combined.includes("simulation")) {
      return <Box className="w-5 h-5 text-purple-400" />;
    }
    if (combined.includes("malware") || combined.includes("bug")) {
      return <Bug className="w-5 h-5 text-rose-400" />;
    }
    if (combined.includes("network") || combined.includes("telemetry")) {
      return <Network className="w-5 h-5 text-sky-400" />;
    }
    if (combined.includes("dfir") || combined.includes("forensics")) {
      return <Terminal className="w-5 h-5 text-emerald-400" />;
    }
    return <Shield className="w-5 h-5 text-[#00F0C0]" />;
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-6 border-b border-white/[0.06]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search labs, scenarios, techniques..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060D19]/90 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00F0C0] transition-colors"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-[#00F0C0]/15 text-[#00F0C0] border border-[#00F0C0]/40 shadow-sm"
                      : "text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Labs Grid */}
      {filteredLabs.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#060D19]/40 border border-dashed border-white/10">
          <Terminal className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Labs Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No labs matched "${searchQuery}".`
              : "No labs currently published in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#071220]/80 border border-white/[0.08] hover:border-[#00F0C0]/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,192,0.1)] group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105">
                    {getLabIcon(lab.name, lab.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getDifficultyColor(
                        lab.difficulty
                      )}`}
                    >
                      {lab.difficulty}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00F0C0]/10 text-[#00F0C0] border border-[#00F0C0]/20">
                      {lab.status}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-[#00E5BE] block mb-1">
                  {lab.category}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-[#00F0C0] transition-colors">
                  {lab.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal mb-5">
                  {lab.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                {lab.url ? (
                  <a
                    href={lab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 text-[#00F0C0] border border-[#00F0C0]/30 hover:border-[#00F0C0] transition-all"
                  >
                    <span>Access Lab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 bg-white/[0.03] border border-white/5">
                    <span>Lab Environment Active</span>
                  </span>
                )}

                {lab.github_url && (
                  <a
                    href={lab.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-colors"
                  >
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
