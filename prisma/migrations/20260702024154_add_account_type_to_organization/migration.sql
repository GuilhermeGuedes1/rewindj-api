-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('AGENCY', 'INDEPENDENT_ARTIST');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'AGENCY';
