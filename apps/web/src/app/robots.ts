import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Brief §6bis — retrieval vs training is the distinction that matters here.
 *
 * Retrieval bots read pages to answer users and can cite the site; blocking
 * them removes us from AI answers entirely. Training bots use content to train
 * models. Many default configs block both and silently kill AI visibility.
 *
 * Both groups are allowed: this is a services site, presence is the point.
 * The training group is the reversible half of that decision.
 *
 * See also /llms.txt — a plain-text brief of the site for AI engines, generated
 * from the live service list.
 */
const retrievalBots = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
];

const trainingBots = ["GPTBot", "Google-Extended", "CCBot", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [...retrievalBots, ...trainingBots],
        allow: "/",
        // Admin, ticket threads and shared quote links must stay out of the
        // index (brief §6bis).
        disallow: ["/api/", "/admin/", "/oferta/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/oferta/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
