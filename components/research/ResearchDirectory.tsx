"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen, Clock, Calendar, ArrowRight, X, Terminal } from "lucide-react";
import { ResearchRow } from "@/lib/data/research";
import { ARTICLE_PREVIEWS, ArticlePreview } from "@/lib/constants/siteData";

interface ResearchDirectoryProps {
  researchRows?: ResearchRow[];
  fallbackArticles?: ArticlePreview[];
}

interface DisplayArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string | null;
  date: string;
  readTime: string;
  author?: string | null;
}

export const ResearchDirectory: React.FC<ResearchDirectoryProps> = ({
  researchRows = [],
  fallbackArticles = ARTICLE_PREVIEWS,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<DisplayArticle | null>(null);

  const articles: DisplayArticle[] = useMemo(() => {
    if (researchRows && researchRows.length > 0) {
      return researchRows.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category || "Security Research",
        excerpt: r.excerpt,
        content: r.content,
        date: r.publication_date
          ? new Date(r.publication_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent",
        readTime: r.content
          ? `${Math.max(1, Math.ceil(r.content.split(/\s+/).length / 200))} min read`
          : "5 min read",
        author: r.author || "Cyberforage Research",
      }));
    }

    return fallbackArticles.map((a, idx) => ({
      id: `fallback-${idx}`,
      title: a.title,
      category: a.category,
      excerpt: a.description,
      content: a.description,
      date: a.date,
      readTime: "5 min read",
      author: "Cyberforage Research",
    }));
  }, [researchRows, fallbackArticles]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return ["All", ...Array.from(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" ||
        a.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [articles, searchQuery, selectedCategory]);

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
            placeholder="Search articles, threat intel, analysis..."
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

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#060D19]/40 border border-dashed border-white/10">
          <Terminal className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Research Articles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No research papers matched "${searchQuery}".`
              : "No research publications found in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#071120]/80 border border-white/[0.07] hover:border-[#00F0C0]/40 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,192,0.1)] group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-medium text-[#00E5BE] tracking-wide">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-[#00F0C0] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-normal mb-5">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{article.date}</span>
                </div>

                <span className="inline-flex items-center gap-1 text-[#00E5BE] group-hover:text-[#00F0C0] font-medium text-xs">
                  <span>Read Brief</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#071120] border border-white/10 p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 pr-8">
              <span className="text-xs font-mono text-[#00E5BE] uppercase tracking-wider block mb-2">
                {activeArticle.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                {activeArticle.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeArticle.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticle.readTime}
                </span>
                {activeArticle.author && <span>By {activeArticle.author}</span>}
              </div>
            </div>

            {/* Body */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 pt-4 border-t border-white/[0.08]">
              {activeArticle.content ? (
                <div className="whitespace-pre-wrap">{activeArticle.content}</div>
              ) : (
                <p>{activeArticle.excerpt}</p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
