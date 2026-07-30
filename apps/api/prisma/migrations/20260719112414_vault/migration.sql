/*
  Warnings:

  - You are about to drop the column `passwordNonce` on the `Credential` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "username" TEXT,
    "passwordEnc" TEXT NOT NULL,
    "loginUrl" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Credential_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ClientProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Credential" ("createdAt", "id", "label", "loginUrl", "note", "passwordEnc", "projectId", "updatedAt", "username") SELECT "createdAt", "id", "label", "loginUrl", "note", "passwordEnc", "projectId", "updatedAt", "username" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
CREATE INDEX "Credential_projectId_idx" ON "Credential"("projectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
