import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";

export type AssignWorkoutInput = {
  groupId: string;
  studentIds: string[];
  date: Date;
  type: string;
  goal?: string | null;
  description?: string | null;
  intensity?: string | null;
  targetDistanceMeters?: number | null;
  targetDurationSec?: number | null;
};

export async function assignWorkout(professor: CurrentUser, input: AssignWorkoutInput) {
  return withUserContext(professor.id, professor.role, (tx) =>
    tx.plannedWorkout.createMany({
      data: input.studentIds.map((studentId) => ({
        groupId: input.groupId,
        studentId,
        assignedById: professor.id,
        date: input.date,
        type: input.type,
        goal: input.goal ?? null,
        description: input.description ?? null,
        intensity: input.intensity ?? null,
        targetDistanceMeters: input.targetDistanceMeters ?? null,
        targetDurationSec: input.targetDurationSec ?? null,
      })),
    })
  );
}

export type PlanEntry = {
  date: Date;
  type: string;
  intensity?: string | null;
  targetDistanceMeters?: number | null;
  targetDurationSec?: number | null;
};

export async function assignPlan(
  professor: CurrentUser,
  groupId: string,
  studentIds: string[],
  entries: PlanEntry[]
) {
  return withUserContext(professor.id, professor.role, (tx) =>
    tx.plannedWorkout.createMany({
      data: entries.flatMap((entry) =>
        studentIds.map((studentId) => ({
          groupId,
          studentId,
          assignedById: professor.id,
          date: entry.date,
          type: entry.type,
          intensity: entry.intensity ?? null,
          targetDistanceMeters: entry.targetDistanceMeters ?? null,
          targetDurationSec: entry.targetDurationSec ?? null,
        }))
      ),
    })
  );
}
