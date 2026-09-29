import React from 'react';
import { X, Calendar, Clock, BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ResearchArticle } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface ArticleReaderModalProps {
  article: ResearchArticle | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#030914] border border-[#00F0C0]/30 shadow-[0_0_50px_rgba(0,240,192,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 bg-[#051122] border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-mono font-medium text-[#00E5BE] tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[#00F0C0]/10 border border-[#00F0C0]/25">
                {article.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {article.title}
            </h2>
          </div>

          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#071526]/80 border-l-4 border-[#00F0C0] text-sm text-slate-200 leading-relaxed font-normal">
            <span className="text-[11px] font-mono text-[#00E5BE] font-bold block mb-1">ABSTRACT</span>
            {article.summary}
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {(Array.isArray(article.content) ? article.content : []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Key Takeaways */}
          <div className="p-5 rounded-xl bg-[#061224] border border-white/5 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#00F0C0] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00F0C0]" />
              <span>Key Defensive Takeaways</span>
            </h4>
            <ul className="space-y-2">
              {(Array.isArray(article.keyTakeaways) ? article.keyTakeaways : []).map((point, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] mt-1.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threat Indicators / IOCs if present */}
          {Array.isArray(article.threatIndicators) && article.threatIndicators.length > 0 && (
            <div className="p-5 rounded-xl bg-[#12070c] border border-rose-500/20 space-y-3">
              <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Detection Signatures & Telemetry Anomalies</span>
              </h4>
              <ul className="space-y-2">
                {article.threatIndicators.map((ioc, idx) => (
                  <li key={idx} className="text-xs font-mono text-rose-200/90 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{ioc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
