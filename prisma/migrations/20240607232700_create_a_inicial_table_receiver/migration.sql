-- CreateTable
CREATE TABLE "Receiver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "completed_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pix_key_type" TEXT NOT NULL,
    "pix_key" TEXT NOT NULL
);
