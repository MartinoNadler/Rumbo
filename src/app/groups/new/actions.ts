"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createGroup, getGroupOwnedBy } from "@/lib/groups";

export type CreateGroupState = { error?: string } | undefined;

export async function createGroupAction(
  _prevState: CreateGroupState,
  formData: FormData
): Promise<CreateGroupState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "PROFESSOR") {
    return { error: "Solo un profesor puede crear un grupo." };
  }

  const existing = await getGroupOwnedBy(user.id);
  if (existing) redirect("/group");

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return { error: "Ponele un nombre al grupo." };
  }

  await createGroup(user.id, name);
  redirect("/group");
}
