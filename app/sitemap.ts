import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://getfreetoolsai.com";
  const lastModified = new Date();

  return [
    // Homepage
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1.0 },

    // Tags page (SEO index)
    { url: `${baseUrl}/tags`, lastModified, changeFrequency: "weekly", priority: 0.9 },

    // PDF Tools
    { url: `${baseUrl}/pdf/compress`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf/merge`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf/split`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pdf/pdf-to-jpg`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pdf/jpg-to-pdf`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pdf/unlock`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pdf/rotate`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pdf/pdf-to-word`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf/ocr`, lastModified, changeFrequency: "monthly", priority: 0.8 },

    // Image Tools
    { url: `${baseUrl}/image/compress`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image/heic-to-jpg`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/background-remover`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image/convert`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/resize`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/crop`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/image/remove-exif`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/image/image-to-text`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
