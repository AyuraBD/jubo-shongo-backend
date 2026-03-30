/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `donations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeEventId]` on the table `donations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "stripeEventId" TEXT,
ADD COLUMN     "transactionId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "donations_transactionId_key" ON "donations"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_stripeEventId_key" ON "donations"("stripeEventId");
