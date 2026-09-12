"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash2, Star } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { togglePublishProjectAction, deleteProjectAction, updateProjectAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  category: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  display_order: number;
  project_tags?: { tag: string }[];
}

export function ProjectListClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = (project: Project) => {
    const newPublished = !project.published;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, published: newPublished } : p))
    );
    startTransition(async () => {
      try {
        await togglePublishProjectAction(project.id, newPublished);
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update project publish status.");
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: !newPublished } : p))
        );
      }
    });
  };

  const handleToggleFeatured = (project: Project) => {
    const newFeatured = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: newFeatured } : p))
    );
    startTransition(async () => {
      try {
        await updateProjectAction(project.id, { featured: newFeatured });
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update featured status.");
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: !newFeatured } : p))
        );
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    try {
      await deleteProjectAction(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
            >
              <option value="all" className="bg-[#081220]">All Statuses</option>
              <option value="planning" className="bg-[#081220]">Planning</option>
              <option value="in_development" className="bg-[#081220]">In Development</option>
              <option value="active" className="bg-[#081220]">Active</option>
              <option value="completed" className="bg-[#081220]">Completed</option>
              <option value="archived" className="bg-[#081220]">Archived</option>
            </select>
          </div>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#040810] font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-white/10 bg-[#081220]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-semibold text-white/60 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Published</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {project.title}
                          {project.featured && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          )}
                        </div>
                        <div className="text-xs text-white/40 truncate max-w-xs mt-0.5">
                          {project.short_description}
                        </div>
                        {project.project_tags && project.project_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {project.project_tags.slice(0, 3).map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-cyan-300/80 border border-cyan-400/10"
                              >
                                {t.tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-xs">
                      {project.category || "General"}
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        disabled={isPending}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.featured
                            ? "text-amber-400 hover:bg-amber-400/10"
                            : "text-white/20 hover:text-white/60 hover:bg-white/5"
                        }`}
                        title={project.featured ? "Unmark featured" : "Mark as featured"}
                      >
                        <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          project.published
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-white/50 text-xs font-mono">
                      {project.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-2 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
