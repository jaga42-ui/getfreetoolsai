import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.getfreetoolsai.com";
  // Stable date so we don't tell Google "every page changed" on every deploy.
  const lastModified = new Date("2026-06-03");

  return [
    // Homepage
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1.0 },

    // Tags page (SEO index)
    { url: `${baseUrl}/tags`, lastModified, changeFrequency: "weekly", priority: 0.9 },

    // Category hubs
    { url: `${baseUrl}/pdf-tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/image-tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },

    // Developer Tools
    { url: `${baseUrl}/dev-tools`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dev-tools/json-formatter`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/dev-tools/json-to-typescript`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/dev-tools/jwt-decoder`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/dev-tools/base64`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/dev-tools/url-encoder`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/dev-tools/uuid`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/dev-tools/regex-tester`, lastModified, changeFrequency: "monthly", priority: 0.8 },

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
    { url: `${baseUrl}/pdf/word-to-pdf`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pdf/png-to-pdf`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pdf/watermark`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pdf/number-pages`, lastModified, changeFrequency: "monthly", priority: 0.7 },

    // Image Tools
    { url: `${baseUrl}/image/compress`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image/heic-to-jpg`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/background-remover`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image/convert`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/resize`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/crop`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/image/remove-exif`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/image/image-to-text`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/upscale`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/image/flip-rotate`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/image/filters`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/image/rounded-corners`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/image/color-picker`, lastModified, changeFrequency: "monthly", priority: 0.7 },

    // Calculators
    { url: `${baseUrl}/calculators`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calculators/emi`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/bmi`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/gst`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/percentage`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/compound-interest`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/discount`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/tip`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/age`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/loan`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/sip`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/salary`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculators/calorie`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/word-counter`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/unit-converter`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/date`, lastModified, changeFrequency: "monthly", priority: 0.7 },

    // Company / legal
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified, changeFrequency: "yearly", priority: 0.4 },
  ];
}
