"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { removeMember } from "@/lib/groups/join";

export async function removeMemberAction(groupId: string, membershipId: string) {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  await removeMember(user, membershipId);
  revalidatePath(`/grupos/${groupId}`);
  revalidatePath("/grupos");
}
