-- The preceding migration has already made Artist.userId mandatory in the
-- deployed database. Preserve existing Artist ids and create only the
-- profiles missing for legacy Users (CEO, ADMIN and PRODUCER in the seed).

INSERT INTO "Artist" (
  id, name, "stageName", phone, "userId", "organizationId", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), u.name, u.name, u.phone, u.id, u."organizationId",
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User" u
WHERE NOT EXISTS (
  SELECT 1 FROM "Artist" a WHERE a."userId" = u.id
);

-- The insert above must make the one-to-one coverage complete.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "User" u
    WHERE NOT EXISTS (SELECT 1 FROM "Artist" a WHERE a."userId" = u.id)
  ) THEN
    RAISE EXCEPTION 'Could not create an Artist for every User.';
  END IF;
END $$;
