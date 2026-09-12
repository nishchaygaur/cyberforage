import { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data/projects";
import { getPublishedArticles } from "@/lib/data/research";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cyberforage.space";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/labs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [projects, articles] = await Promise.all([
      getPublishedProjects(),
      getPublishedArticles(),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${baseUrl}/projects#${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const articleRoutes: MetadataRoute.Sitemap = articles.map((a, idx) => ({
      url: `${baseUrl}/research#article-${idx + 1}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
