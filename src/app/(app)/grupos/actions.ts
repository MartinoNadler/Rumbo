"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { createGroup } from "@/lib/groups/create";

export type CreateGroupState = { error?: string } | undefined;

export async function createGroupAction(
  _prevState: CreateGroupState,
  formData: FormData
): Promise<CreateGroupState> {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Ponele un nombre al grupo." };

  await createGroup(user, name);
  revalidatePath("/grupos");
}
