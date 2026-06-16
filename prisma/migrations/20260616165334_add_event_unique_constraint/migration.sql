/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,artistId,eventDate,title]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_organizationId_artistId_eventDate_title_key" ON "Event"("organizationId", "artistId", "eventDate", "title");
