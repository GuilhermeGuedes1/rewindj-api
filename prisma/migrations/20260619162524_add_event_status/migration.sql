-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('NEGOTIATING', 'CONFIRMED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'NEGOTIATING';
