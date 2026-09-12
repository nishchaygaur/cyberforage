"use client";

import { useState } from "react";
import { Save, Palette, RotateCcw } from "lucide-react";
import { updateAppearanceAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

const DEFAULT_APPEARANCE = {
  primary_accent: "#06B6D4", // Cyan
  secondary_accent: "#A855F7", // Purple
  background_color: "#040810", // Dark slate
  text_color: "#F8FAFC",
  card_background: "#081220",
  font_family: "Inter, sans-serif",
  border_radius: "16px",
  globe_color: "#06B6D4",
  glow_color: "rgba(6, 182, 212, 0.4)",
};

export function AppearanceClient({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState({
    primary_accent: initialSettings?.primary_accent || DEFAULT_APPEARANCE.primary_accent,
    secondary_accent: initialSettings?.secondary_accent || DEFAULT_APPEARANCE.secondary_accent,
    background_color: initialSettings?.background_color || DEFAULT_APPEARANCE.background_color,
    text_color: initialSettings?.text_color || DEFAULT_APPEARANCE.text_color,
    card_background: initialSettings?.card_background || DEFAULT_APPEARANCE.card_background,
    font_family: initialSettings?.font_family || DEFAULT_APPEARANCE.font_family,
    border_radius: initialSettings?.border_radius || DEFAULT_APPEARANCE.border_radius,
    globe_color: initialSettings?.globe_color || DEFAULT_APPEARANCE.globe_color,
    glow_color: initialSettings?.glow_color || DEFAULT_APPEARANCE.glow_color,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleResetDefaults = () => {
    setFormData(DEFAULT_APPEARANCE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateAppearanceAction(formData);
      setSuccessMessage("Design tokens updated successfully.");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save appearance settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Palette Preview Card */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            Active Design Theme & Swatches
          </h3>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div
              className="w-full h-10 rounded-lg mb-2 border border-white/10"
              style={{ backgroundColor: formData.primary_accent }}
            />
            <span className="text-xs text-white/60 block">Primary Accent</span>
            <span className="text-[10px] font-mono text-white/40">{formData.primary_accent}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div
              className="w-full h-10 rounded-lg mb-2 border border-white/10"
              style={{ backgroundColor: formData.secondary_accent }}
            />
            <span className="text-xs text-white/60 block">Secondary Accent</span>
            <span className="text-[10px] font-mono text-white/40">{formData.secondary_accent}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div
              className="w-full h-10 rounded-lg mb-2 border border-white/10"
              style={{ backgroundColor: formData.background_color }}
            />
            <span className="text-xs text-white/60 block">Background</span>
            <span className="text-[10px] font-mono text-white/40">{formData.background_color}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div
              className="w-full h-10 rounded-lg mb-2 border border-white/10"
              style={{ backgroundColor: formData.card_background }}
            />
            <span className="text-xs text-white/60 block">Surface / Cards</span>
            <span className="text-[10px] font-mono text-white/40">{formData.card_background}</span>
          </div>
        </div>
      </div>

      {/* Hex Controls */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-5">
        <h3 className="text-base font-semibold text-white">Color Tokens</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Primary Accent Hex
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.primary_accent}
                onChange={(e) => setFormData((p) => ({ ...p, primary_accent: e.target.value }))}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.primary_accent}
                onChange={(e) => setFormData((p) => ({ ...p, primary_accent: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Secondary Accent Hex
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.secondary_accent}
                onChange={(e) => setFormData((p) => ({ ...p, secondary_accent: e.target.value }))}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.secondary_accent}
                onChange={(e) => setFormData((p) => ({ ...p, secondary_accent: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Canvas Globe Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.globe_color}
                onChange={(e) => setFormData((p) => ({ ...p, globe_color: e.target.value }))}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.globe_color}
                onChange={(e) => setFormData((p) => ({ ...p, globe_color: e.target.value }))}
                className="flex-1 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Canvas Glow Shadow Token
            </label>
            <input
              type="text"
              value={formData.glow_color}
              onChange={(e) => setFormData((p) => ({ ...p, glow_color: e.target.value }))}
              placeholder="rgba(6, 182, 212, 0.4)"
              className="w-full px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Save Appearance"}
        </button>
      </div>
    </form>
  );
}
