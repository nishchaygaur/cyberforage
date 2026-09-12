"use server";

import * as projectsData from "@/lib/data/projects";
import * as researchData from "@/lib/data/research";
import * as labsData from "@/lib/data/labs";
import * as techData from "@/lib/data/technologies";
import * as exploreData from "@/lib/data/exploration";
import * as contactData from "@/lib/data/contact";
import * as socialData from "@/lib/data/social";
import * as navData from "@/lib/data/navigation";
import * as siteData from "@/lib/data/site";
import * as seoData from "@/lib/data/seo";
import * as mediaData from "@/lib/data/media";
import { ContactSubmissionStatus } from "@/types/database";

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==========================================
// Projects
// ==========================================
export async function createProjectAction(data: any, tags: string[] = []): Promise<ActionResponse<projectsData.ProjectRow>> {
  try {
    const result = await projectsData.createProject(data, tags);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createProjectAction error:", err);
    return { success: false, error: err.message || "Failed to create project." };
  }
}

export async function updateProjectAction(id: string, updates: any, tags?: string[]): Promise<ActionResponse<projectsData.ProjectRow>> {
  try {
    const result = await projectsData.updateProject(id, updates, tags);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateProjectAction error:", err);
    return { success: false, error: err.message || "Failed to update project." };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResponse> {
  try {
    const result = await projectsData.deleteProject(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteProjectAction error:", err);
    return { success: false, error: err.message || "Failed to delete project." };
  }
}

export async function togglePublishProjectAction(id: string, published: boolean): Promise<ActionResponse<projectsData.ProjectRow>> {
  try {
    const result = await projectsData.togglePublishProject(id, published);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("togglePublishProjectAction error:", err);
    return { success: false, error: err.message || "Failed to toggle project publish status." };
  }
}

// ==========================================
// Research
// ==========================================
export async function createResearchAction(data: any, tags: string[] = []): Promise<ActionResponse<researchData.ResearchRow>> {
  try {
    const result = await researchData.createArticle(data, tags);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createResearchAction error:", err);
    return { success: false, error: err.message || "Failed to create article." };
  }
}

export async function updateResearchAction(id: string, updates: any, tags?: string[]): Promise<ActionResponse<researchData.ResearchRow>> {
  try {
    const result = await researchData.updateArticle(id, updates, tags);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateResearchAction error:", err);
    return { success: false, error: err.message || "Failed to update article." };
  }
}

export async function deleteResearchAction(id: string): Promise<ActionResponse> {
  try {
    const result = await researchData.deleteArticle(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteResearchAction error:", err);
    return { success: false, error: err.message || "Failed to delete article." };
  }
}

export async function togglePublishResearchAction(id: string, published: boolean): Promise<ActionResponse<researchData.ResearchRow>> {
  try {
    const result = await researchData.updateArticle(id, { published });
    return { success: true, data: result };
  } catch (err: any) {
    console.error("togglePublishResearchAction error:", err);
    return { success: false, error: err.message || "Failed to toggle research publish status." };
  }
}

// ==========================================
// Labs
// ==========================================
export async function createLabAction(data: any): Promise<ActionResponse<labsData.LabRow>> {
  try {
    const result = await labsData.createLab(data);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createLabAction error:", err);
    return { success: false, error: err.message || "Failed to create lab." };
  }
}

export async function updateLabAction(id: string, updates: any): Promise<ActionResponse<labsData.LabRow>> {
  try {
    const result = await labsData.updateLab(id, updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateLabAction error:", err);
    return { success: false, error: err.message || "Failed to update lab." };
  }
}

export async function deleteLabAction(id: string): Promise<ActionResponse> {
  try {
    const result = await labsData.deleteLab(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteLabAction error:", err);
    return { success: false, error: err.message || "Failed to delete lab." };
  }
}

// ==========================================
// Technologies
// ==========================================
export async function createTechAction(data: any): Promise<ActionResponse<techData.TechRow>> {
  try {
    const result = await techData.createTechnology(data);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createTechAction error:", err);
    return { success: false, error: err.message || "Failed to create technology." };
  }
}

export async function updateTechAction(id: string, updates: any): Promise<ActionResponse<techData.TechRow>> {
  try {
    const result = await techData.updateTechnology(id, updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateTechAction error:", err);
    return { success: false, error: err.message || "Failed to update technology." };
  }
}

export async function deleteTechAction(id: string): Promise<ActionResponse> {
  try {
    const result = await techData.deleteTechnology(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteTechAction error:", err);
    return { success: false, error: err.message || "Failed to delete technology." };
  }
}

// ==========================================
// Exploration
// ==========================================
export async function createExplorationAction(data: any): Promise<ActionResponse<exploreData.ExplorationRow>> {
  try {
    const result = await exploreData.createExplorationItem(data);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createExplorationAction error:", err);
    return { success: false, error: err.message || "Failed to create exploration item." };
  }
}

export async function updateExplorationAction(id: string, updates: any): Promise<ActionResponse<exploreData.ExplorationRow>> {
  try {
    const result = await exploreData.updateExplorationItem(id, updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateExplorationAction error:", err);
    return { success: false, error: err.message || "Failed to update exploration item." };
  }
}

export async function deleteExplorationAction(id: string): Promise<ActionResponse> {
  try {
    const result = await exploreData.deleteExplorationItem(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteExplorationAction error:", err);
    return { success: false, error: err.message || "Failed to delete exploration item." };
  }
}

// ==========================================
// Contact Info & Submissions
// ==========================================
export async function updateContactInfoAction(updates: any): Promise<ActionResponse<contactData.ContactInfoRow>> {
  try {
    const result = await contactData.updateContactInfo(updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateContactInfoAction error:", err);
    return { success: false, error: err.message || "Failed to update contact info." };
  }
}

export async function updateSubmissionStatusAction(id: string, status: ContactSubmissionStatus): Promise<ActionResponse<contactData.ContactSubmissionRow>> {
  try {
    const result = await contactData.updateSubmissionStatus(id, status);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateSubmissionStatusAction error:", err);
    return { success: false, error: err.message || "Failed to update submission status." };
  }
}

export async function deleteSubmissionAction(id: string): Promise<ActionResponse> {
  try {
    const result = await contactData.deleteSubmission(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteSubmissionAction error:", err);
    return { success: false, error: err.message || "Failed to delete submission." };
  }
}

export async function submitContactAction(submission: any): Promise<ActionResponse> {
  try {
    const result = await contactData.submitContactForm(submission);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("submitContactAction error:", err);
    return { success: false, error: err.message || "Failed to submit contact inquiry." };
  }
}

// ==========================================
// Social Links
// ==========================================
export async function createSocialAction(data: any): Promise<ActionResponse<socialData.SocialRow>> {
  try {
    const result = await socialData.createSocialLink(data);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createSocialAction failed:", err);
    return { success: false, error: err.message || "Failed to create social link" };
  }
}

export async function updateSocialAction(id: string, updates: any): Promise<ActionResponse<socialData.SocialRow>> {
  try {
    const result = await socialData.updateSocialLink(id, updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateSocialAction failed:", err);
    return { success: false, error: err.message || "Failed to update social link" };
  }
}

export async function deleteSocialAction(id: string): Promise<ActionResponse> {
  try {
    const result = await socialData.deleteSocialLink(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteSocialAction failed:", err);
    return { success: false, error: err.message || "Failed to delete social link" };
  }
}

export async function reorderSocialAction(orderedIds: string[]): Promise<ActionResponse> {
  try {
    const result = await socialData.reorderSocialLinks(orderedIds);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("reorderSocialAction failed:", err);
    return { success: false, error: err.message || "Failed to reorder social links" };
  }
}

// ==========================================
// Navigation
// ==========================================
export async function createNavAction(data: any): Promise<ActionResponse<navData.NavigationRow>> {
  try {
    const result = await navData.createNavigationItem(data);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("createNavAction error:", err);
    return { success: false, error: err.message || "Failed to create navigation item." };
  }
}

export async function updateNavAction(id: string, updates: any): Promise<ActionResponse<navData.NavigationRow>> {
  try {
    const result = await navData.updateNavigationItem(id, updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateNavAction error:", err);
    return { success: false, error: err.message || "Failed to update navigation item." };
  }
}

export async function deleteNavAction(id: string): Promise<ActionResponse> {
  try {
    const result = await navData.deleteNavigationItem(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteNavAction error:", err);
    return { success: false, error: err.message || "Failed to delete navigation item." };
  }
}

// ==========================================
// Site Settings
// ==========================================
export async function updateSiteSettingsAction(updates: any): Promise<ActionResponse<siteData.SiteSettingsRow>> {
  try {
    const result = await siteData.updateSiteSettings(updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateSiteSettingsAction error:", err);
    return { success: false, error: err.message || "Failed to update site settings." };
  }
}

// ==========================================
// Appearance
// ==========================================
export async function updateAppearanceAction(updates: any): Promise<ActionResponse<siteData.AppearanceRow>> {
  try {
    const result = await siteData.updateAppearanceSettings(updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateAppearanceAction error:", err);
    return { success: false, error: err.message || "Failed to update appearance settings." };
  }
}

// ==========================================
// SEO
// ==========================================
export async function updateSeoAction(updates: any): Promise<ActionResponse<seoData.SeoSettingsRow>> {
  try {
    const result = await seoData.updateSeoSettings(updates);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateSeoAction error:", err);
    return { success: false, error: err.message || "Failed to update SEO settings." };
  }
}

// ==========================================
// Media
// ==========================================
export async function uploadMediaAction(formData: FormData): Promise<ActionResponse<mediaData.MediaRow>> {
  try {
    const result = await mediaData.uploadMediaFile(formData);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("uploadMediaAction error:", err);
    return { success: false, error: err.message || "Failed to upload media file." };
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResponse> {
  try {
    const result = await mediaData.deleteMediaFile(id);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("deleteMediaAction error:", err);
    return { success: false, error: err.message || "Failed to delete media file." };
  }
}
