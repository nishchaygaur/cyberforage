"use client";

import { useState, useTransition } from "react";
import { Upload, Search, Copy, Check, Trash2, Eye, Image as ImageIcon, AlertCircle } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { uploadMediaAction, deleteMediaAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  alt_text: string | null;
  description: string | null;
  created_at: string;
}

export function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [altText, setAltText] = useState("");
  const router = useRouter();

  const filtered = mediaList.filter((m) =>
    m.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.alt_text && m.alt_text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText.trim());

    try {
      const res = await uploadMediaAction(formData);
      if (res && !res.success) throw new Error(res.error || "Failed to upload file. Ensure Supabase Storage is configured.");
      const uploaded = res?.data;
      if (uploaded) setMediaList((prev) => [uploaded, ...prev]);
      setSuccessMessage(`File "${file.name}" uploaded successfully.`);
      setAltText("");
      e.target.value = "";
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload file. Ensure Supabase Storage is configured.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteMediaAction(deleteTarget.id);
      if (res && !res.success) throw new Error(res.error || "Failed to delete file.");
      setMediaList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (previewItem?.id === deleteTarget.id) setPreviewItem(null);
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete file.");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}

      {/* Upload Zone */}
      <div className="p-6 rounded-2xl bg-[#081220]/60 border border-white/10 backdrop-blur-sm space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyan-400" />
          Upload New Asset (Supabase Storage: cyberforage-media)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-white/60 mb-1">
              Alt Text / Description (Optional)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Cyberforage architecture diagram"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              Select Image (PNG, JPG, WEBP, SVG &lt; 5MB)
            </label>
            <label className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-cyan-400/40 text-cyan-400 text-sm cursor-pointer hover:bg-cyan-400/10 transition-colors ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}>
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Uploading..." : "Choose File"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
        </div>
        <div className="text-xs text-white/40">
          Total Assets: <span className="font-mono text-white">{mediaList.length}</span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-white/40 border border-white/10 rounded-2xl bg-[#081220]/40">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-400" />
          No media files found. Upload your first asset above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-white/10 bg-[#081220]/80 overflow-hidden hover:border-cyan-400/40 transition-all flex flex-col"
            >
              <div className="aspect-square bg-black/40 relative overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.public_url}
                  alt={item.alt_text || item.file_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to icon if preview fails
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-cyan-400 hover:text-black transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(item.public_url, item.id)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-cyan-400 hover:text-black transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 text-xs space-y-1">
                <div className="font-medium text-white truncate" title={item.file_name}>
                  {item.file_name}
                </div>
                <div className="text-[10px] text-white/40 flex items-center justify-between">
                  <span>{formatBytes(item.file_size)}</span>
                  <span className="uppercase">{item.mime_type.split("/")[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-[#081220] border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white truncate">{previewItem.file_name}</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-hidden rounded-xl border border-white/10 bg-black/50 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.public_url}
                alt={previewItem.file_name}
                className="max-h-80 w-auto object-contain rounded-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/40">Direct CDN URL:</span>
                <button
                  onClick={() => handleCopyUrl(previewItem.public_url, previewItem.id)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === previewItem.id ? "Copied!" : "Copy Link"}
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <input
                readOnly
                value={previewItem.public_url}
                className="w-full px-2 py-1 rounded bg-black/40 border border-white/5 text-white/70 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media Asset"
        message={`Delete "${deleteTarget?.file_name}" from Supabase Storage and database? This action cannot be undone.`}
        confirmText="Delete Asset"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
