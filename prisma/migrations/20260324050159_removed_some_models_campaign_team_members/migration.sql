/*
  Warnings:

  - You are about to drop the column `images` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `campaign_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_updates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campaign_tags" DROP CONSTRAINT "campaign_tags_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_tags" DROP CONSTRAINT "campaign_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "campaign_updates" DROP CONSTRAINT "campaign_updates_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_userId_fkey";

-- DropIndex
DROP INDEX "campaigns_slug_key";

-- DropIndex
DROP INDEX "events_slug_key";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "images",
DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'DONOR';

-- DropTable
DROP TABLE "campaign_tags";

-- DropTable
DROP TABLE "campaign_updates";

-- DropTable
DROP TABLE "tags";

-- DropTable
DROP TABLE "team_members";

-- DropEnum
DROP TYPE "MemberGroup";

-- DropEnum
DROP TYPE "MemberStatus";
