/*
  Warnings:

  - The primary key for the `Receiver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Receiver` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receiver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "completed_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pix_key_type" TEXT NOT NULL,
    "pix_key" TEXT NOT NULL
);
INSERT INTO "new_Receiver" ("completed_name", "cpf_cnpj", "email", "id", "pix_key", "pix_key_type", "status") SELECT "completed_name", "cpf_cnpj", "email", "id", "pix_key", "pix_key_type", "status" FROM "Receiver";
DROP TABLE "Receiver";
ALTER TABLE "new_Receiver" RENAME TO "Receiver";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
