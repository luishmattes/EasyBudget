-- CreateTable
CREATE TABLE "Gasto" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);
