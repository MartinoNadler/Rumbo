"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { joinGroupByCode, leaveGroup } from "@/lib/groups/join";

export type JoinGroupState = { error?: string } | undefined;

export async function joinGroupAction(
  _prevState: JoinGroupState,
  formData: FormData
): Promise<JoinGroupState> {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  const code = (formData.get("inviteCode") as string)?.trim();
  if (!code) return { error: "Ingresá un código de invitación." };

  try {
    await joinGroupByCode(user, code);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo unir al grupo." };
  }

  revalidatePath("/config");
}

export async function leaveGroupAction() {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  await leaveGroup(user);
  revalidatePath("/config");
}
