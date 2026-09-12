import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Box, FileSearch, Terminal, Cpu } from "lucide-react";
import { FEATURED_PROJECTS, ProjectData } from "@/lib/constants/siteData";

interface FeaturedProjectsProps {
  projects?: ProjectData[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  // Determine display projects: prioritize featured items, fallback to all published, or default static
  const displayProjects: ProjectData[] = React.useMemo(() => {
    if (projects && projects.length > 0) {
      const featured = projects.filter((p) => p.featured);
      if (featured.length > 0) return featured.slice(0, 3);
      return projects.slice(0, 3);
    }
    return FEATURED_PROJECTS;
  }, [projects]);

  const getProjectIcon = (iconName?: string | null, accent?: string, index: number = 0) => {
    const name = iconName?.toLowerCase() || "";
    if (name.includes("shield")) return <ShieldCheck className="w-6 h-6" />;
    if (name.includes("box") || name.includes("cube")) return <Box className="w-6 h-6" />;
    if (name.includes("search") || name.includes("file")) return <FileSearch className="w-6 h-6" />;
    if (name.includes("terminal") || name.includes("code")) return <Terminal className="w-6 h-6" />;
    if (name.includes("cpu") || name.includes("chip") || name.includes("ai")) return <Cpu className="w-6 h-6" />;

    if (accent === "purple" || index === 1) return <Box className="w-6 h-6" />;
    if (accent === "rose" || index === 2) return <FileSearch className="w-6 h-6" />;
    return <ShieldCheck className="w-6 h-6" />;
  };

  const getAccentConfig = (accent?: string) => {
    switch (accent) {
      case "purple":
        return {
          text: "text-[#A855F7]",
          bg: "bg-[#A855F7]/10",
          border: "border-[#A855F7]/30",
          hoverBorder: "hover:border-[#A855F7]/40",
          shadow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.12)]",
          btnBorder: "border-[#A855F7]/40 hover:border-[#A855F7]",
          btnHoverBg: "hover:bg-[#A855F7]/10",
          arrowText: "text-[#A855F7]",
          subText: "text-[#C084FC]",
          watermarkBorder: "border-[#A855F7]/10",
        };
      case "rose":
        return {
          text: "text-[#F43F5E]",
          bg: "bg-[#F43F5E]/10",
          border: "border-[#F43F5E]/30",
          hoverBorder: "hover:border-[#F43F5E]/40",
          shadow: "hover:shadow-[0_0_25px_rgba(244,63,94,0.12)]",
          btnBorder: "border-[#F43F5E]/40 hover:border-[#F43F5E]",
          btnHoverBg: "hover:bg-[#F43F5E]/10",
          arrowText: "text-[#F43F5E]",
          subText: "text-[#FB7185]",
          watermarkBorder: "border-[#F43F5E]/10",
        };
      case "cyan":
      default:
        return {
          text: "text-[#00F0C0]",
          bg: "bg-[#00F0C0]/10",
          border: "border-[#00F0C0]/30",
          hoverBorder: "hover:border-[#00F0C0]/40",
          shadow: "hover:shadow-[0_0_25px_rgba(0,240,192,0.12)]",
          btnBorder: "border-[#00F0C0]/40 hover:border-[#00F0C0]",
          btnHoverBg: "hover:bg-[#00F0C0]/10",
          arrowText: "text-[#00F0C0]",
          subText: "text-[#00E5BE]",
          watermarkBorder: "border-[#00F0C0]/10",
        };
    }
  };

  return (
    <section
      id="projects"
      className="relative py-16 md:py-24 border-t border-white/[0.04]"
      aria-label="Featured Projects"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              FEATURED PROJECTS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Built for Real-World Security
            </h2>
          </div>
          <Link
            href="/projects"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-[#00F0C0] transition-colors self-start sm:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, idx) => {
            const styles = getAccentConfig(project.accent);
            const targetUrl =
              project.project_url || project.demo_url || project.github_url || null;

            return (
              <div
                key={project.id || project.title}
                className={`relative p-7 rounded-2xl bg-[#081220]/90 border border-white/[0.08] ${styles.hoverBorder} backdrop-blur-sm transition-all duration-300 ${styles.shadow} flex flex-col overflow-hidden group`}
              >
                {/* Top Right Radar Watermark */}
                <div
                  className={`absolute -top-6 -right-6 w-36 h-36 border ${styles.watermarkBorder} rounded-full pointer-events-none`}
                  aria-hidden="true"
                >
                  <div className={`absolute inset-4 border ${styles.watermarkBorder} rounded-full opacity-60`} />
                  <div className={`absolute inset-8 border ${styles.watermarkBorder} rounded-full opacity-40`} />
                </div>

                {/* Header: Icon + Title + Subtitle */}
                <div className="flex items-start gap-3.5 mb-4 relative z-10">
                  <div
                    className={`w-11 h-11 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.text} flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    {getProjectIcon(project.icon, project.accent, idx)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white tracking-tight truncate">
                      {project.title}
                    </h3>
                    <p className={`text-xs font-mono ${styles.subText} font-medium tracking-wide truncate`}>
                      {project.subtitle || project.category || "Security Solution"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 relative z-10 font-normal line-clamp-3">
                  {project.description}
                </p>

                {/* Tags or Workflow Pipeline */}
                <div className="my-auto py-3 relative z-10">
                  {project.workflow && project.workflow.length > 0 ? (
                    <div className="flex items-center flex-wrap gap-1 text-[10px] sm:text-[11px] font-mono text-slate-300">
                      {project.workflow.map((step, sIdx, arr) => (
                        <React.Fragment key={step}>
                          <span
                            className={`px-1.5 py-0.5 rounded transition-colors ${
                              step === "MITRE" || sIdx === arr.length - 1
                                ? "bg-[#00F0C0]/15 text-[#00F0C0] font-semibold border border-[#00F0C0]/30 shadow-[0_0_8px_rgba(0,240,192,0.2)]"
                                : "bg-[#060D17] text-slate-300 border border-white/5 hover:border-[#00F0C0]/20"
                            }`}
                          >
                            {step}
                          </span>
                          {sIdx < arr.length - 1 && (
                            <span className="text-[#00F0C0]/60 text-[9px] px-0.5">›</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : project.tags && project.tags.length > 0 ? (
                    <div className="flex items-center flex-wrap gap-1.5 text-[10px] sm:text-[11px] font-mono">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-[#060D17] text-slate-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Bottom CTA Button: rendered only when valid URL exists */}
                {targetUrl ? (
                  <div className="pt-6 relative z-10 mt-auto">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050E1A] ${styles.btnHoverBg} border ${styles.btnBorder} text-xs font-medium text-slate-200 hover:text-white transition-all group/btn`}
                    >
                      <span>View Project</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${styles.arrowText} transition-transform group-hover/btn:translate-x-1`} />
                    </a>
                  </div>
                ) : (
                  <div className="pt-6 relative z-10 mt-auto">
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050E1A] hover:bg-white/5 border border-white/10 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all group/btn"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
