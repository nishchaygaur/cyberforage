"use client";

import React, { useState, useMemo } from "react";
import { Search, ExternalLink, Terminal, BookOpen } from "lucide-react";
import { ProjectData } from "@/lib/constants/siteData";
import { sanitizeWebUrl } from "@/lib/utils/url";

interface ProjectsDirectoryProps {
  projects: ProjectData[];
}

export const ProjectsDirectory: React.FC<ProjectsDirectoryProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [projects, searchQuery, selectedCategory]);

  const getAccentStyles = (accent: ProjectData["accent"]) => {
    switch (accent) {
      case "purple":
        return {
          border: "border-purple-500/20 hover:border-purple-400/50",
          glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
          badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
          button: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30 hover:border-purple-400",
        };
      case "rose":
        return {
          border: "border-rose-500/20 hover:border-rose-400/50",
          glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.12)]",
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          button: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 hover:border-rose-400",
        };
      case "cyan":
      default:
        return {
          border: "border-[#00F0C0]/20 hover:border-[#00F0C0]/50",
          glow: "hover:shadow-[0_0_30px_rgba(0,240,192,0.12)]",
          badge: "bg-[#00F0C0]/10 text-[#00F0C0] border-[#00F0C0]/30",
          button: "bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/30 hover:border-[#00F0C0]",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls: Search Bar and Category Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-6 border-b border-white/[0.06]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tags, tooling..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060D19]/90 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00F0C0] transition-colors"
          />
        </div>

        {/* Category Pills */}
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

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#060D19]/40 border border-dashed border-white/10">
          <Terminal className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No projects matched the search term "${searchQuery}".`
              : "No projects currently published in this category."}
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-1.5 text-xs font-medium text-[#00F0C0] bg-[#00F0C0]/10 rounded-lg hover:bg-[#00F0C0]/20 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const styles = getAccentStyles(project.accent);
            const targetUrl = sanitizeWebUrl(project.project_url || project.demo_url);
            const docUrl = sanitizeWebUrl(project.documentation_url);
            const githubUrl = sanitizeWebUrl(project.github_url);

            return (
              <div
                key={project.id}
                className={`group flex flex-col justify-between p-6 rounded-2xl bg-[#071220]/80 border ${styles.border} backdrop-blur-sm transition-all duration-300 ${styles.glow} relative overflow-hidden`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${styles.badge}`}
                    >
                      {project.status || (project.featured ? "Featured" : "Active")}
                    </span>

                    {project.category && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {project.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-1.5 group-hover:text-[#00F0C0] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs font-mono text-[#00E5BE] mb-3 leading-relaxed">
                    {project.subtitle}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-5">
                    {project.description}
                  </p>
                </div>

                {/* Footer: Tags & Actions */}
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {targetUrl && (
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${styles.button}`}
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {docUrl && (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-[#00F0C0] bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#00F0C0]/30 transition-colors group/doc"
                        title="View Documentation"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#00E5BE] group-hover/doc:text-[#00F0C0] transition-colors" />
                        <span>Documentation</span>
                      </a>
                    )}

                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-colors"
                      >
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
