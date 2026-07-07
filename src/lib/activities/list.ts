import type { CurrentUser } from "@/lib/auth";
import { withUserContext } from "@/lib/db-context";

export async function getRecentActivities(user: CurrentUser, limit = 10) {
  return withUserContext(user.id, user.role, (tx) =>
    tx.activity.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "desc" },
      take: limit,
    })
  );
}
