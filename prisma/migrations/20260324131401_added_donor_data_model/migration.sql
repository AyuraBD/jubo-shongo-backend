-- CreateTable
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "address" TEXT,
    "city" TEXT,
    "district" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "totalDonated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "donationCount" INTEGER NOT NULL DEFAULT 0,
    "campaignCount" INTEGER NOT NULL DEFAULT 0,
    "lastDonatedAt" TIMESTAMP(3),
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "receiveUpdates" BOOLEAN NOT NULL DEFAULT true,
    "receiveReceipt" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "donors_userId_key" ON "donors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "donors_email_key" ON "donors"("email");

-- CreateIndex
CREATE INDEX "donors_email_idx" ON "donors"("email");

-- CreateIndex
CREATE INDEX "donors_userId_idx" ON "donors"("userId");

-- CreateIndex
CREATE INDEX "donors_district_idx" ON "donors"("district");

-- CreateIndex
CREATE INDEX "donors_totalDonated_idx" ON "donors"("totalDonated");

-- CreateIndex
CREATE INDEX "donors_lastDonatedAt_idx" ON "donors"("lastDonatedAt");

-- CreateIndex
CREATE INDEX "donors_deletedAt_idx" ON "donors"("deletedAt");

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
