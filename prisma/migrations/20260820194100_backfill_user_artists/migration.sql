-- Idempotent data backfill. Existing Artist identifiers are never changed,
-- preserving Event.artistId and any external references.
ALTER TABLE "Invite" ADD COLUMN "createdByArtistId" TEXT;

UPDATE "Artist" a
SET
  "profileImageKey" = COALESCE(a."profileImageKey", u."profileImageKey"),
  role = u.role,
  "organizationId" = CASE
    WHEN o."accountType" = 'INDEPENDENT_ARTIST' THEN NULL
    ELSE u."organizationId"
  END,
  "isIndependent" = o."accountType" = 'INDEPENDENT_ARTIST'
FROM "User" u
JOIN "Organization" o ON o.id = u."organizationId"
WHERE a."userId" = u.id;

INSERT INTO "Artist" (
  id, name, "stageName", phone, "profileImageKey", role, "userId",
  "organizationId", "isIndependent", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), u.name, u.name, u.phone, u."profileImageKey", u.role,
  u.id,
  CASE WHEN o."accountType" = 'INDEPENDENT_ARTIST' THEN NULL ELSE u."organizationId" END,
  o."accountType" = 'INDEPENDENT_ARTIST', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User" u
JOIN "Organization" o ON o.id = u."organizationId"
WHERE NOT EXISTS (
  SELECT 1 FROM "Artist" a WHERE a."userId" = u.id
);

UPDATE "Invite" i
SET "createdByArtistId" = a.id
FROM "Artist" a
WHERE a."userId" = i."createdById"
  AND i."createdByArtistId" IS NULL;

ALTER TABLE "Invite"
  ADD CONSTRAINT "Invite_createdByArtistId_fkey"
  FOREIGN KEY ("createdByArtistId") REFERENCES "Artist"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
