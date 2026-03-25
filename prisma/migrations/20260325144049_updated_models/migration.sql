/*
  Warnings:

  - You are about to alter the column `amount` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- DropIndex
DROP INDEX "donors_email_key";

-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);
