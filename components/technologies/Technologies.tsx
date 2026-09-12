import React from "react";
import { TECHNOLOGIES } from "@/lib/constants/siteData";

export const Technologies: React.FC = () => {
  const renderTechIcon = (name: string) => {
    switch (name) {
      case "Python":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <path
              d="M11.9 2C8.7 2 8.9 3.4 8.9 3.4L8.9 4.8H12V5.3H6.3C3.6 5.3 3.6 8.3 3.6 8.3L3.6 10.3C3.6 12 5.1 12 5.1 12H6.5V10.6C6.5 9 7.9 9 7.9 9H11.9C13.4 9 13.4 7.6 13.4 7.6V3.4C13.4 2 11.9 2 11.9 2ZM10.5 3C10.9 3 11.2 3.3 11.2 3.8C11.2 4.2 10.9 4.5 10.5 4.5C10.1 4.5 9.8 4.2 9.8 3.8C9.8 3.3 10.1 3 10.5 3Z"
              fill="#38BDF8"
            />
            <path
              d="M12.1 22C15.3 22 15.1 20.6 15.1 20.6L15.1 19.2H12V18.7H17.7C20.4 18.7 20.4 15.7 20.4 15.7L20.4 13.7C20.4 12 18.9 12 18.9 12H17.5V13.4C17.5 15 16.1 15 16.1 15H12.1C10.6 15 10.6 16.4 10.6 16.4V20.6C10.6 22 12.1 22 12.1 22ZM13.5 21C13.1 21 12.8 20.7 12.8 20.2C12.8 19.8 13.1 19.5 13.5 19.5C13.9 19.5 14.2 19.8 14.2 20.2C14.2 20.7 13.9 21 13.5 21Z"
              fill="#FBBF24"
            />
          </svg>
        );
      case "Linux":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M12.012 2c-3.136 0-4.013 2.805-4.013 4.28 0 .614.07 1.348.24 2.128-1.52.883-2.613 2.656-2.613 4.742 0 1.25.405 2.378 1.059 3.273-.205.772-.345 1.637-.345 2.577 0 2.228.877 3 2.671 3 1.042 0 2.457-.655 3.001-2 .999.655 2.01.655 3.001 0 .544 1.345 1.959 2 3.001 2 1.794 0 2.671-.772 2.671-3 0-.94-.14-1.805-.345-2.577.654-.895 1.059-2.023 1.059-3.273 0-2.086-1.093-3.859-2.613-4.742.17-.78.24-1.514.24-2.128C16.025 4.805 15.148 2 12.012 2z" />
          </svg>
        );
      case "PostgreSQL":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#38BDF8">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        );
      case "Docker":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#38BDF8">
            <path d="M22.5 11.5c-.3-.2-1.3-.7-2.7-.4-.2-.8-.7-1.5-1.4-2l-.6-.4-.4.6c-.5.8-.7 1.8-.6 2.7-.8-.1-2.4 0-3.5 1.1-.3-.2-.7-.4-1.1-.5V7.4h2.2V5.2h-2.2V3h-2.2v2.2H8.9V3H6.7v2.2H4.5V3H2.3v4.4h2.2v2.2H2.3v2.2h8.8c.4.1.8.3 1.1.5-1.5 1.4-1.9 3.5-1.1 5.3 1.2 2.7 4.2 4.1 7.2 3.4 2.8-.7 4.7-3.2 4.7-6.1 0-.9-.2-1.8-.7-2.6.3-.3.5-.6.6-.9l.2-.5-.6-.1z" />
          </svg>
        );
      case "GitHub":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        );
      case "YARA":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#00F0C0" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="4" fill="#00F0C0" fillOpacity="0.3" />
          </svg>
        );
      case "MITRE":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="5" stroke="#EF4444" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="#EF4444" />
          </svg>
        );
      case "NIST":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#10B981" strokeWidth="2">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        );
      case "Cloud":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#38BDF8" strokeWidth="2">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        );
      case "AI":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#A855F7" strokeWidth="2">
            <circle cx="12" cy="12" r="3" fill="#A855F7" />
            <circle cx="6" cy="6" r="2" stroke="#00F0C0" />
            <circle cx="18" cy="6" r="2" stroke="#00F0C0" />
            <circle cx="6" cy="18" r="2" stroke="#00F0C0" />
            <circle cx="18" cy="18" r="2" stroke="#00F0C0" />
            <line x1="8" y1="7" x2="10" y2="10" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="16" y1="7" x2="14" y2="10" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="8" y1="17" x2="10" y2="14" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="16" y1="17" x2="14" y2="14" stroke="#38BDF8" strokeWidth="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="technologies"
      className="relative py-16 md:py-24 border-t border-white/[0.04]"
      aria-label="Technologies"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel: Technologies Title + Equalizer Bar Graphic */}
          <div className="lg:col-span-3 rounded-2xl bg-[#060D19]/80 border border-white/[0.07] p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                TECHNOLOGIES
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Powered by Modern Tools.
              </h2>
            </div>

            {/* Glowing Equalizer Bar Visual */}
            <div className="pt-8 pb-2 flex items-end justify-center gap-3">
              {[
                { height: "45px", glow: "#00F0C0" },
                { height: "70px", glow: "#00E5BE" },
                { height: "95px", glow: "#00F0C0" },
                { height: "60px", glow: "#38BDF8" },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full bg-[#00F0C0] shadow-[0_0_8px_#00F0C0]"
                    style={{ backgroundColor: bar.glow }}
                  />
                  <div
                    className="w-5 rounded-t-sm bg-gradient-to-t from-transparent via-[#00F0C0]/20 to-[#00F0C0]/60 border-t border-l border-r border-[#00F0C0]/40 transition-all duration-500 hover:brightness-125"
                    style={{ height: bar.height }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center Panel: 10 Tools Grid (2 rows of 5) */}
          <div className="lg:col-span-6 rounded-2xl bg-[#060D19]/80 border border-white/[0.07] p-6 flex flex-col justify-center">
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              {TECHNOLOGIES.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-[#091424]/70 border border-white/[0.06] hover:border-[#00F0C0]/40 transition-all duration-200 group hover:shadow-[0_0_15px_rgba(0,240,192,0.1)] cursor-pointer"
                >
                  <div className="text-slate-300 group-hover:scale-110 transition-transform mb-2">
                    {renderTechIcon(tech.name)}
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono text-slate-300 group-hover:text-white transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: The Big Picture Node Architecture Diagram */}
          <div className="lg:col-span-3 rounded-2xl bg-[#060D19]/80 border border-white/[0.07] p-6 flex flex-col justify-between">
            <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-3">
              THE BIG PICTURE
            </div>

            <div className="space-y-3 my-auto">
              <div className="p-2.5 rounded-lg bg-[#0A1628] border border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Defense Core</span>
                <span className="px-2 py-0.5 rounded bg-[#00F0C0]/15 text-[#00F0C0] text-[10px] font-mono">
                  Active
                </span>
              </div>

              <div className="flex justify-center">
                <div className="w-[1px] h-3 bg-[#00F0C0]/40" />
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A1628] border border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Threat Stream</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-mono">
                  Telemetry
                </span>
              </div>

              <div className="flex justify-center">
                <div className="w-[1px] h-3 bg-[#00F0C0]/40" />
              </div>

              <div className="p-2.5 rounded-lg bg-[#0A1628] border border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-semibold text-white">AI Automation</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 text-[10px] font-mono">
                  Response
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono mt-4 text-center">
              Interconnected Security Mesh
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
