-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "artistId" TEXT,
ALTER COLUMN "organizationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
