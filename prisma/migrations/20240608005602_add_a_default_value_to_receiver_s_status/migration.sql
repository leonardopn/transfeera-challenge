-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receiver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "completed_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Rascunho',
    "pix_key_type" TEXT NOT NULL,
    "pix_key" TEXT NOT NULL
);
INSERT INTO "new_Receiver" ("completed_name", "cpf_cnpj", "email", "id", "pix_key", "pix_key_type", "status") SELECT "completed_name", "cpf_cnpj", "email", "id", "pix_key", "pix_key_type", "status" FROM "Receiver";
DROP TABLE "Receiver";
ALTER TABLE "new_Receiver" RENAME TO "Receiver";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
