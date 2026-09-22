/*
  Warnings:

  - You are about to drop the column `email` on the `Artist` table. All the data in the column will be lost.
  - Made the column `userId` on table `Artist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropIndex
DROP INDEX "Artist_email_key";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "email",
ADD COLUMN     "isIndependent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profileImageKey" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ARTIST',
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
