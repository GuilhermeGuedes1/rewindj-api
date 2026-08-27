BEGIN;

UPDATE "Artist" a
SET
  name = u.name,
  phone = u.phone,
  "profileImageKey" = u."profileImageKey",
  role = u.role,
  "organizationId" = u."organizationId",
  "isIndependent" = CASE
    WHEN o."accountType" = 'INDEPENDENT_ARTIST' THEN true
    ELSE false
  END
FROM "User" u
JOIN "Organization" o
  ON o.id = u."organizationId"
WHERE a."userId" = u.id;

INSERT INTO "Artist" (
  id,
  name,
  "stageName",
  phone,
  "profileImageKey",
  role,
  "userId",
  "organizationId",
  "isIndependent",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  u.name,
  u.name,
  u.phone,
  u."profileImageKey",
  u.role,
  u.id,
  CASE
    WHEN o."accountType" = 'INDEPENDENT_ARTIST' THEN NULL
    ELSE u."organizationId"
  END,
  CASE
    WHEN o."accountType" = 'INDEPENDENT_ARTIST' THEN true
    ELSE false
  END,
  NOW(),
  NOW()
FROM "User" u
JOIN "Organization" o
  ON o.id = u."organizationId"
LEFT JOIN "Artist" a
  ON a."userId" = u.id
WHERE a.id IS NULL;

COMMIT;