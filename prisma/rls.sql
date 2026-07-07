-- =============================================================================
-- RLS setup for seguimiento-mvp
--
-- Prisma's schema.prisma cannot express Postgres Row-Level Security, so this
-- file is applied by hand (Supabase SQL editor or psql), AFTER the Prisma
-- migration that creates the tables.
--
-- Design:
--   * Tables are owned by the migration role (Supabase's default "postgres"
--     user, via DIRECT_URL). Table owners bypass RLS by default, which is
--     exactly what `prisma migrate` needs.
--   * The app connects at runtime (DATABASE_URL, used by Prisma Client) as a
--     separate, restricted role: app_user. It is NOT an owner and has
--     NOBYPASSRLS, so every policy below is actually enforced for it.
--   * Every request sets two session variables before querying
--     (see src/lib/db-context.ts):
--       app.current_user_id  -> the signed-in user's id (uuid, as text)
--       app.current_role     -> 'STUDENT' | 'PROFESSOR'
--     Policies read them back with current_setting(..., true), which is the
--     Postgres-side source of truth — not something the application code can
--     forge, since app_user has no privilege to bypass RLS regardless of
--     what a buggy server action might do.
--
-- Run this once per environment. Re-running is idempotent (DROP ... IF EXISTS
-- before each CREATE).
-- =============================================================================

-- 1) Restricted runtime role -------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user LOGIN PASSWORD 'REPLACE_ME' NOBYPASSRLS;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Make sure tables created by future `prisma migrate` runs (as the owner
-- role) are automatically granted to app_user too.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;

-- 2) Helper functions (SECURITY DEFINER: run with the definer's bypass so
--    that checking group membership never gets tangled in the RLS policies
--    of the tables they query) -------------------------------------------

CREATE OR REPLACE FUNCTION app_current_user_id() RETURNS text
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '');
$$;

CREATE OR REPLACE FUNCTION app_current_role() RETURNS text
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT current_setting('app.current_role', true);
$$;

-- Is the current user the professor who owns target_user_id's group?
CREATE OR REPLACE FUNCTION app_is_professor_of(target_user_id text) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "Membership" m
    JOIN "Group" g ON g.id = m."groupId"
    WHERE m."userId" = target_user_id
      AND g."professorId" = app_current_user_id()
  );
$$;

-- Does the current user belong to (as student or owning professor) target_group_id?
CREATE OR REPLACE FUNCTION app_has_group_access(target_group_id text) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Group" g
    WHERE g.id = target_group_id AND g."professorId" = app_current_user_id()
  ) OR EXISTS (
    SELECT 1 FROM "Membership" m
    WHERE m."groupId" = target_group_id AND m."userId" = app_current_user_id()
  );
$$;

-- Do the current user and target_user_id share any group (either as
-- classmates, or professor <-> own student)?
CREATE OR REPLACE FUNCTION app_shares_group_with(target_user_id text) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "Membership" m1
    JOIN "Membership" m2 ON m1."groupId" = m2."groupId"
    WHERE m1."userId" = app_current_user_id() AND m2."userId" = target_user_id
  ) OR app_is_professor_of(target_user_id);
$$;

GRANT EXECUTE ON FUNCTION app_current_user_id() TO app_user;
GRANT EXECUTE ON FUNCTION app_current_role() TO app_user;
GRANT EXECUTE ON FUNCTION app_is_professor_of(text) TO app_user;
GRANT EXECUTE ON FUNCTION app_has_group_access(text) TO app_user;
GRANT EXECUTE ON FUNCTION app_shares_group_with(text) TO app_user;

-- 3) Enable RLS ---------------------------------------------------------

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Group" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlannedWorkout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Badge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserBadge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StravaAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;

-- 4) Policies -------------------------------------------------------------

-- User: see your own profile, classmates, or (as professor) your students.
DROP POLICY IF EXISTS user_select ON "User";
CREATE POLICY user_select ON "User" FOR SELECT USING (
  id = app_current_user_id() OR app_shares_group_with(id)
);

DROP POLICY IF EXISTS user_insert ON "User";
CREATE POLICY user_insert ON "User" FOR INSERT WITH CHECK (
  id = app_current_user_id()
);

DROP POLICY IF EXISTS user_update ON "User";
CREATE POLICY user_update ON "User" FOR UPDATE USING (
  id = app_current_user_id()
);

-- Group: professors manage groups they own; students read groups they're in.
DROP POLICY IF EXISTS group_select ON "Group";
CREATE POLICY group_select ON "Group" FOR SELECT USING (
  "professorId" = app_current_user_id() OR app_has_group_access(id)
);

DROP POLICY IF EXISTS group_write ON "Group";
CREATE POLICY group_write ON "Group" FOR ALL USING (
  "professorId" = app_current_user_id()
) WITH CHECK (
  "professorId" = app_current_user_id()
);

-- Membership: visible to the member and the group's professor.
DROP POLICY IF EXISTS membership_select ON "Membership";
CREATE POLICY membership_select ON "Membership" FOR SELECT USING (
  "userId" = app_current_user_id() OR app_is_professor_of("userId")
);

DROP POLICY IF EXISTS membership_insert ON "Membership";
CREATE POLICY membership_insert ON "Membership" FOR INSERT WITH CHECK (
  "userId" = app_current_user_id()
);

DROP POLICY IF EXISTS membership_delete ON "Membership";
CREATE POLICY membership_delete ON "Membership" FOR DELETE USING (
  "userId" = app_current_user_id() OR app_is_professor_of("userId")
);

-- PlannedWorkout: student reads their own; professor manages workouts for
-- their own students only.
DROP POLICY IF EXISTS planned_workout_select ON "PlannedWorkout";
CREATE POLICY planned_workout_select ON "PlannedWorkout" FOR SELECT USING (
  "studentId" = app_current_user_id() OR app_is_professor_of("studentId")
);

DROP POLICY IF EXISTS planned_workout_write ON "PlannedWorkout";
CREATE POLICY planned_workout_write ON "PlannedWorkout" FOR ALL USING (
  "assignedById" = app_current_user_id() AND app_is_professor_of("studentId")
) WITH CHECK (
  "assignedById" = app_current_user_id() AND app_is_professor_of("studentId")
);

-- Activity: strictly private to its owner, except professors get read-only
-- access to their own students' activities.
DROP POLICY IF EXISTS activity_select ON "Activity";
CREATE POLICY activity_select ON "Activity" FOR SELECT USING (
  "userId" = app_current_user_id() OR app_is_professor_of("userId")
);

DROP POLICY IF EXISTS activity_write ON "Activity";
CREATE POLICY activity_write ON "Activity" FOR INSERT WITH CHECK (
  "userId" = app_current_user_id()
);

DROP POLICY IF EXISTS activity_update ON "Activity";
CREATE POLICY activity_update ON "Activity" FOR UPDATE USING (
  "userId" = app_current_user_id()
);

DROP POLICY IF EXISTS activity_delete ON "Activity";
CREATE POLICY activity_delete ON "Activity" FOR DELETE USING (
  "userId" = app_current_user_id()
);

-- Post/Comment/Reaction: visible to anyone with access to the parent group;
-- only the author can write their own contribution.
DROP POLICY IF EXISTS post_select ON "Post";
CREATE POLICY post_select ON "Post" FOR SELECT USING (
  app_has_group_access("groupId")
);

DROP POLICY IF EXISTS post_insert ON "Post";
CREATE POLICY post_insert ON "Post" FOR INSERT WITH CHECK (
  "authorId" = app_current_user_id() AND app_has_group_access("groupId")
);

DROP POLICY IF EXISTS post_write ON "Post";
CREATE POLICY post_write ON "Post" FOR UPDATE USING ("authorId" = app_current_user_id());

DROP POLICY IF EXISTS post_delete ON "Post";
CREATE POLICY post_delete ON "Post" FOR DELETE USING ("authorId" = app_current_user_id());

DROP POLICY IF EXISTS comment_select ON "Comment";
CREATE POLICY comment_select ON "Comment" FOR SELECT USING (
  EXISTS (SELECT 1 FROM "Post" p WHERE p.id = "postId" AND app_has_group_access(p."groupId"))
);

DROP POLICY IF EXISTS comment_insert ON "Comment";
CREATE POLICY comment_insert ON "Comment" FOR INSERT WITH CHECK (
  "authorId" = app_current_user_id()
  AND EXISTS (SELECT 1 FROM "Post" p WHERE p.id = "postId" AND app_has_group_access(p."groupId"))
);

DROP POLICY IF EXISTS comment_delete ON "Comment";
CREATE POLICY comment_delete ON "Comment" FOR DELETE USING ("authorId" = app_current_user_id());

DROP POLICY IF EXISTS reaction_select ON "Reaction";
CREATE POLICY reaction_select ON "Reaction" FOR SELECT USING (
  EXISTS (SELECT 1 FROM "Post" p WHERE p.id = "postId" AND app_has_group_access(p."groupId"))
);

DROP POLICY IF EXISTS reaction_insert ON "Reaction";
CREATE POLICY reaction_insert ON "Reaction" FOR INSERT WITH CHECK (
  "userId" = app_current_user_id()
  AND EXISTS (SELECT 1 FROM "Post" p WHERE p.id = "postId" AND app_has_group_access(p."groupId"))
);

DROP POLICY IF EXISTS reaction_delete ON "Reaction";
CREATE POLICY reaction_delete ON "Reaction" FOR DELETE USING ("userId" = app_current_user_id());

-- Goal: private to the owner; professor gets read-only access to their students'.
DROP POLICY IF EXISTS goal_select ON "Goal";
CREATE POLICY goal_select ON "Goal" FOR SELECT USING (
  "userId" = app_current_user_id() OR app_is_professor_of("userId")
);

DROP POLICY IF EXISTS goal_write ON "Goal";
CREATE POLICY goal_write ON "Goal" FOR ALL USING (
  "userId" = app_current_user_id()
) WITH CHECK (
  "userId" = app_current_user_id()
);

-- Badge: public catalog, read-only for everyone (awarded via seed/admin, not app_user).
DROP POLICY IF EXISTS badge_select ON "Badge";
CREATE POLICY badge_select ON "Badge" FOR SELECT USING (true);

-- UserBadge: visible to the owner and their professor; awarded to yourself only.
DROP POLICY IF EXISTS user_badge_select ON "UserBadge";
CREATE POLICY user_badge_select ON "UserBadge" FOR SELECT USING (
  "userId" = app_current_user_id() OR app_is_professor_of("userId")
);

DROP POLICY IF EXISTS user_badge_insert ON "UserBadge";
CREATE POLICY user_badge_insert ON "UserBadge" FOR INSERT WITH CHECK (
  "userId" = app_current_user_id()
);

-- StravaAccount: strictly private to the owner.
DROP POLICY IF EXISTS strava_account_all ON "StravaAccount";
CREATE POLICY strava_account_all ON "StravaAccount" FOR ALL USING (
  "userId" = app_current_user_id()
) WITH CHECK (
  "userId" = app_current_user_id()
);
