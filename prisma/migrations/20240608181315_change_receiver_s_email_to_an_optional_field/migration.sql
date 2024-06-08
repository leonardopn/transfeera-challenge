-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receiver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "completed_name" TEXT NOT NULL,
    "email" TEXT DEFAULT '',
    "cpf_cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Rascunho',
    "pix_key_type" TEXT NOT NULL,
    "pix_key" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Receiver" ("completed_name", "cpf_cnpj", "created_at", "email", "id", "pix_key", "pix_key_type", "status", "updated_at") SELECT "completed_name", "cpf_cnpj", "created_at", "email", "id", "pix_key", "pix_key_type", "status", "updated_at" FROM "Receiver";
DROP TABLE "Receiver";
ALTER TABLE "new_Receiver" RENAME TO "Receiver";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
