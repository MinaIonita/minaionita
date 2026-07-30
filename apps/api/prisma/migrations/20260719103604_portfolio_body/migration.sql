-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'RO',
    "client" TEXT NOT NULL,
    "industry" TEXT,
    "challenge" TEXT,
    "solution" TEXT,
    "body" JSONB,
    "metric" TEXT,
    "metricLabel" TEXT,
    "liveUrl" TEXT,
    "tech" JSONB,
    "gallery" JSONB,
    "category" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioItem_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "SeoMeta" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PortfolioItem" ("category", "challenge", "client", "createdAt", "featured", "gallery", "id", "industry", "liveUrl", "locale", "metric", "metricLabel", "order", "publishedAt", "seoId", "slug", "solution", "status", "tech", "updatedAt") SELECT "category", "challenge", "client", "createdAt", "featured", "gallery", "id", "industry", "liveUrl", "locale", "metric", "metricLabel", "order", "publishedAt", "seoId", "slug", "solution", "status", "tech", "updatedAt" FROM "PortfolioItem";
DROP TABLE "PortfolioItem";
ALTER TABLE "new_PortfolioItem" RENAME TO "PortfolioItem";
CREATE UNIQUE INDEX "PortfolioItem_seoId_key" ON "PortfolioItem"("seoId");
CREATE INDEX "PortfolioItem_category_idx" ON "PortfolioItem"("category");
CREATE UNIQUE INDEX "PortfolioItem_slug_locale_key" ON "PortfolioItem"("slug", "locale");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
