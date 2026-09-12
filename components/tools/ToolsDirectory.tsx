"use client";

import React, { useState, useMemo } from "react";
import { Search, ExternalLink, Terminal, Shield, Cpu, Cloud, Database, Wrench, BookOpen } from "lucide-react";
import { TechRow } from "@/lib/data/technologies";
import { TECHNOLOGIES, TechItem } from "@/lib/constants/siteData";

interface ToolsDirectoryProps {
  techRows?: TechRow[];
  fallbackTechs?: TechItem[];
}

export const ToolsDirectory: React.FC<ToolsDirectoryProps> = ({
  techRows = [],
  fallbackTechs = TECHNOLOGIES,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const tools = useMemo(() => {
    if (techRows && techRows.length > 0) {
      return techRows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category || "Tool",
        description: r.description || `Core component of the Cyberforage security and automation pipeline.`,
        url: r.website_url,
        github_url: r.github_url,
      }));
    }

    return fallbackTechs.map((t, idx) => ({
      id: `tech-${idx}`,
      name: t.name,
      category: t.category,
      description: `Core tooling and technology utilized across Cyberforage platforms and threat defense labs.`,
      url: null,
      github_url: null,
    }));
  }, [techRows, fallbackTechs]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    tools.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return ["All", ...Array.from(cats)];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" ||
        t.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [tools, searchQuery, selectedCategory]);

  const getToolIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes("defense") || c.includes("security")) {
      return <Shield className="w-5 h-5 text-[#00F0C0]" />;
    }
    if (c.includes("ai") || c.includes("ml")) {
      return <Cpu className="w-5 h-5 text-purple-400" />;
    }
    if (c.includes("cloud")) {
      return <Cloud className="w-5 h-5 text-sky-400" />;
    }
    if (c.includes("database") || c.includes("storage")) {
      return <Database className="w-5 h-5 text-amber-400" />;
    }
    return <Wrench className="w-5 h-5 text-blue-400" />;
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
            placeholder="Search technologies, tools, stacks..."
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

      {/* Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#060D19]/40 border border-dashed border-white/10">
          <Terminal className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Tools Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No tools matched "${searchQuery}".`
              : "No tools found in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-[#071220]/80 border border-white/[0.07] hover:border-[#00F0C0]/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,192,0.1)] group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105">
                    {getToolIcon(tool.category)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                    {tool.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight mb-1.5 group-hover:text-[#00F0C0] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal mb-4 line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {(tool.url || tool.github_url) && (
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-3 text-xs">
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00E5BE] hover:text-[#00F0C0] transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {tool.github_url && (
                    <a
                      href={tool.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
