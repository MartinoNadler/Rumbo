import type { WorkoutStatus } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";

export async function setWorkoutStatus(
  student: CurrentUser,
  workoutId: string,
  status: WorkoutStatus
) {
  return withUserContext(student.id, student.role, (tx) =>
    tx.plannedWorkout.update({
      where: { id: workoutId, studentId: student.id },
      data: { status },
    })
  );
}
