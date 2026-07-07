import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function getTodaysWorkout(student: CurrentUser) {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  return withUserContext(student.id, student.role, (tx) =>
    tx.plannedWorkout.findFirst({
      where: { studentId: student.id, date: { gte: today, lt: tomorrow } },
      orderBy: { createdAt: "desc" },
    })
  );
}

export async function getPreviousWorkout(student: CurrentUser) {
  const today = startOfDay(new Date());

  return withUserContext(student.id, student.role, (tx) =>
    tx.plannedWorkout.findFirst({
      where: { studentId: student.id, date: { lt: today } },
      orderBy: { date: "desc" },
    })
  );
}
