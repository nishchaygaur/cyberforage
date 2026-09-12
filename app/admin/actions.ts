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
import * as usersData from "@/lib/data/users";
import * as mediaData from "@/lib/data/media";
import { UserRole, ContactSubmissionStatus } from "@/types/database";

// Projects
export async function createProjectAction(data: any, tags: string[] = []) {
  return await projectsData.createProject(data, tags);
}
export async function updateProjectAction(id: string, updates: any, tags?: string[]) {
  return await projectsData.updateProject(id, updates, tags);
}
export async function deleteProjectAction(id: string) {
  return await projectsData.deleteProject(id);
}
export async function togglePublishProjectAction(id: string, published: boolean) {
  return await projectsData.togglePublishProject(id, published);
}

// Research
export async function createResearchAction(data: any, tags: string[] = []) {
  return await researchData.createArticle(data, tags);
}
export async function updateResearchAction(id: string, updates: any, tags?: string[]) {
  return await researchData.updateArticle(id, updates, tags);
}
export async function deleteResearchAction(id: string) {
  return await researchData.deleteArticle(id);
}
export async function togglePublishResearchAction(id: string, published: boolean) {
  return await researchData.updateArticle(id, { published });
}

// Labs
export async function createLabAction(data: any) {
  return await labsData.createLab(data);
}
export async function updateLabAction(id: string, updates: any) {
  return await labsData.updateLab(id, updates);
}
export async function deleteLabAction(id: string) {
  return await labsData.deleteLab(id);
}

// Technologies
export async function createTechAction(data: any) {
  return await techData.createTechnology(data);
}
export async function updateTechAction(id: string, updates: any) {
  return await techData.updateTechnology(id, updates);
}
export async function deleteTechAction(id: string) {
  return await techData.deleteTechnology(id);
}

// Exploration
export async function createExplorationAction(data: any) {
  return await exploreData.createExplorationItem(data);
}
export async function updateExplorationAction(id: string, updates: any) {
  return await exploreData.updateExplorationItem(id, updates);
}
export async function deleteExplorationAction(id: string) {
  return await exploreData.deleteExplorationItem(id);
}

// Contact Info & Submissions
export async function updateContactInfoAction(updates: any) {
  return await contactData.updateContactInfo(updates);
}
export async function updateSubmissionStatusAction(id: string, status: ContactSubmissionStatus) {
  return await contactData.updateSubmissionStatus(id, status);
}
export async function deleteSubmissionAction(id: string) {
  return await contactData.deleteSubmission(id);
}
export async function submitContactAction(submission: any) {
  return await contactData.submitContactForm(submission);
}

// Social Links
export async function createSocialAction(data: any) {
  return await socialData.createSocialLink(data);
}
export async function updateSocialAction(id: string, updates: any) {
  return await socialData.updateSocialLink(id, updates);
}
export async function deleteSocialAction(id: string) {
  return await socialData.deleteSocialLink(id);
}

// Navigation
export async function createNavAction(data: any) {
  return await navData.createNavigationItem(data);
}
export async function updateNavAction(id: string, updates: any) {
  return await navData.updateNavigationItem(id, updates);
}
export async function deleteNavAction(id: string) {
  return await navData.deleteNavigationItem(id);
}

// Site Settings
export async function updateSiteSettingsAction(updates: any) {
  return await siteData.updateSiteSettings(updates);
}

// Appearance
export async function updateAppearanceAction(updates: any) {
  return await siteData.updateAppearanceSettings(updates);
}

// SEO
export async function updateSeoAction(updates: any) {
  return await seoData.updateSeoSettings(updates);
}

// Users
export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  return await usersData.updateUserRole(userId, newRole);
}
export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  return await usersData.toggleUserActive(userId, isActive);
}

// Media
export async function uploadMediaAction(formData: FormData) {
  return await mediaData.uploadMediaFile(formData);
}
export async function deleteMediaAction(id: string) {
  return await mediaData.deleteMediaFile(id);
}
