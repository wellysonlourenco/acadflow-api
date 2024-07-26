-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusCertificado" AS ENUM ('PENDENTE', 'LIBERADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'USUARIO',
    "dt_cadastro" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "avatar" VARCHAR(60),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "dt_inicio" TIMESTAMP(0) NOT NULL,
    "dt_fim" TIMESTAMP(0) NOT NULL,
    "qtd_horas" INTEGER NOT NULL,
    "qtd_vagas" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "imagem" VARCHAR(120),
    "dt_cadastro" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificado" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "inscricao_id" INTEGER NOT NULL,
    "status" "StatusCertificado" NOT NULL DEFAULT 'PENDENTE',
    "dt_cadastro" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(60),

    CONSTRAINT "certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participante" (
    "id" SERIAL NOT NULL,
    "numero_inscricao" VARCHAR(20) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "dt_inscricao" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "participante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificado" ADD CONSTRAINT "certificado_inscricao_id_fkey" FOREIGN KEY ("inscricao_id") REFERENCES "participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
