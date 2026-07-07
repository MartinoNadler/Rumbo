"use server";

import { revalidatePath } from "next/cache";
import type { WorkoutStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { requireRole } from "@/lib/nav-guard";
import { setWorkoutStatus } from "@/lib/workouts/status";

export async function setWorkoutStatusAction(workoutId: string, status: WorkoutStatus) {
  const user = await requireUser();
  requireRole(user.role, "STUDENT");

  await setWorkoutStatus(user, workoutId, status);
  revalidatePath("/hoy");
}
