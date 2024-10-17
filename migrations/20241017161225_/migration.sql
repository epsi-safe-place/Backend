/*
  Warnings:

  - You are about to alter the column `toxic_score` on the `Comments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `Integer`.
  - You are about to alter the column `toxic_score` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "toxic_score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "toxic_score" SET DATA TYPE INTEGER;
