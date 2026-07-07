"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { removeMember } from "@/lib/groups/join";
import { assignWorkout } from "@/lib/workouts/create";

export async function removeMemberAction(groupId: string, membershipId: string) {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  await removeMember(user, membershipId);
  revalidatePath(`/grupos/${groupId}`);
  revalidatePath("/grupos");
}

export type AssignWorkoutState = { error?: string; message?: string } | undefined;

export async function assignWorkoutAction(
  groupId: string,
  studentIds: string[],
  _prevState: AssignWorkoutState,
  formData: FormData
): Promise<AssignWorkoutState> {
  const user = await requireUser();
  requireRole(user.role, "PROFESSOR");

  const studentId = formData.get("studentId") as string;
  const targetIds = studentId === "ALL" ? studentIds : [studentId];
  if (targetIds.length === 0) {
    return { error: "El grupo todavía no tiene alumnos." };
  }

  const date = formData.get("date") as string;
  const type = (formData.get("type") as string)?.trim();
  if (!date || !type) return { error: "Completá al menos la fecha y el tipo de entrenamiento." };

  const distanceKm = formData.get("targetDistanceKm") as string;
  const durationMin = formData.get("targetDurationMin") as string;

  await assignWorkout(user, {
    groupId,
    studentIds: targetIds,
    date: new Date(date),
    type,
    goal: (formData.get("goal") as string) || null,
    description: (formData.get("description") as string) || null,
    intensity: (formData.get("intensity") as string) || null,
    targetDistanceMeters: distanceKm ? parseFloat(distanceKm) * 1000 : null,
    targetDurationSec: durationMin ? Math.round(parseFloat(durationMin) * 60) : null,
  });

  revalidatePath(`/grupos/${groupId}`);
  return { message: "Entrenamiento asignado." };
}
