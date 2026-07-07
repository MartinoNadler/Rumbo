import { cache } from "react";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { withUserContext } from "@/lib/db-context";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  nickname: string | null;
  role: Role;
};

/**
 * Resolves the signed-in Supabase user and its profile row. Cached per
 * request so layouts/pages can all call it without duplicating queries.
 *
 * The profile lookup runs with a placeholder "STUDENT" role in the RLS
 * session context: the "read your own row" policy only checks `id`, so the
 * placeholder never grants access beyond the user's own profile.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await withUserContext(user.id, "STUDENT", (tx) =>
    tx.user.findUnique({ where: { id: user.id } })
  );

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    nickname: profile.nickname,
    role: profile.role,
  };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
